using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using FluentValidation;
using RestaurantPOS.Features.Authentication.Services;
using RestaurantPOS.Shared;

namespace RestaurantPOS.Features.Orders.Controllers
{
    [RoutePrefix("api/v1/orders")]
    public class OrdersController : ApiController
    {
        private readonly IOrderService _orderService;
        private readonly AuditLogService _auditLogService;
        private readonly Settings.ISettingsService _settingsService;
        private readonly Printing.IPrinterService _printerService;

        public OrdersController(
            IOrderService orderService,
            AuditLogService auditLogService,
            Settings.ISettingsService settingsService,
            Printing.IPrinterService printerService)
        {
            _orderService = orderService;
            _auditLogService = auditLogService;
            _settingsService = settingsService;
            _printerService = printerService;
        }

        [HttpGet]
        [Route("")]
        public async Task<IHttpActionResult> GetAll()
        {
            var orders = await _orderService.GetAllAsync();
            return Ok(ApiResponse<IEnumerable<OrderDto>>.Ok(orders));
        }

        [HttpGet]
        [Route("invoices")]
        public async Task<IHttpActionResult> SearchInvoices(
            [FromUri] string search = null,
            [FromUri] string orderType = null,
            [FromUri] string paymentMethod = null,
            [FromUri] DateTime? dateFrom = null,
            [FromUri] DateTime? dateTo = null)
        {
            var orders = await _orderService.SearchInvoicesAsync(search, orderType, paymentMethod, dateFrom, dateTo);
            return Ok(ApiResponse<IEnumerable<OrderDto>>.Ok(orders));
        }

        [HttpPost]
        [Route("{id:int}/reprint")]
        public async Task<IHttpActionResult> Reprint(int id)
        {
            try
            {
                var order = await _orderService.GetByIdAsync(id);
                if (order == null)
                {
                    return Ok(ApiResponse.Fail("Order not found"));
                }

                var settings = await _settingsService.GetAsync();
                _printerService.PrintCashierCopy(order, settings);

                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Reprint", "Order", order.Id, $"Reprinted invoice: {order.InvoiceNumber}");
                return Ok(ApiResponse.Ok("Invoice reprinted successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpGet]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> GetById(int id)
        {
            var order = await _orderService.GetByIdAsync(id);
            if (order == null)
            {
                return Ok(ApiResponse.Fail("Order not found"));
            }
            return Ok(ApiResponse<OrderDto>.Ok(order));
        }

        [HttpPost]
        [Route("")]
        public async Task<IHttpActionResult> Create([FromBody] CreateOrderDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            try
            {
                var order = await _orderService.CreateOrderAsync(dto);
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Create", "Order", order.Id, $"Created order: {order.InvoiceNumber}");
                return Ok(ApiResponse<OrderDto>.Ok(order, "Order created successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpPost]
        [Route("{id:int}/items")]
        public async Task<IHttpActionResult> AddItem(int id, [FromBody] OrderItemDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            try
            {
                var order = await _orderService.AddItemAsync(id, dto);
                return Ok(ApiResponse<OrderDto>.Ok(order, "Item added successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpPut]
        [Route("{id:int}/items/{itemId:int}")]
        public async Task<IHttpActionResult> UpdateItem(int id, int itemId, [FromBody] UpdateOrderItemDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            try
            {
                var order = await _orderService.UpdateItemAsync(id, itemId, dto);
                return Ok(ApiResponse<OrderDto>.Ok(order, "Item updated successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpDelete]
        [Route("{id:int}/items/{itemId:int}")]
        public async Task<IHttpActionResult> RemoveItem(int id, int itemId)
        {
            try
            {
                var order = await _orderService.RemoveItemAsync(id, itemId);
                return Ok(ApiResponse<OrderDto>.Ok(order, "Item removed successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpPatch]
        [Route("{id:int}/discount")]
        public async Task<IHttpActionResult> ApplyDiscount(int id, [FromBody] ApplyDiscountDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            try
            {
                var order = await _orderService.ApplyDiscountAsync(id, dto);
                return Ok(ApiResponse<OrderDto>.Ok(order, "Discount applied successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpDelete]
        [Route("{id:int}/discount")]
        public async Task<IHttpActionResult> RemoveDiscount(int id)
        {
            try
            {
                var order = await _orderService.RemoveDiscountAsync(id);
                return Ok(ApiResponse<OrderDto>.Ok(order, "Discount removed successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpPatch]
        [Route("{id:int}/service-charge")]
        public async Task<IHttpActionResult> ApplyServiceCharge(int id, [FromBody] ApplyServiceChargeDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            try
            {
                var order = await _orderService.ApplyServiceChargeAsync(id, dto);
                return Ok(ApiResponse<OrderDto>.Ok(order, "Service charge applied successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpDelete]
        [Route("{id:int}/service-charge")]
        public async Task<IHttpActionResult> RemoveServiceCharge(int id)
        {
            try
            {
                var order = await _orderService.RemoveServiceChargeAsync(id);
                return Ok(ApiResponse<OrderDto>.Ok(order, "Service charge removed successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpPatch]
        [Route("{id:int}/complete")]
        public async Task<IHttpActionResult> Complete(int id, [FromBody] CompleteOrderDto dto)
        {
            if (dto == null)
            {
                return BadRequest("Request body is required");
            }

            try
            {
                var order = await _orderService.CompleteOrderAsync(id, dto);
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Complete", "Order", order.Id, $"Completed order: {order.InvoiceNumber}");
                return Ok(ApiResponse<OrderDto>.Ok(order, "Order completed successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpGet]
        [Route("hold")]
        public async Task<IHttpActionResult> GetHoldOrders()
        {
            var orders = await _orderService.GetHoldOrdersAsync();
            return Ok(ApiResponse<IEnumerable<OrderDto>>.Ok(orders));
        }

        [HttpPatch]
        [Route("{id:int}/resume")]
        public async Task<IHttpActionResult> Resume(int id)
        {
            try
            {
                var order = await _orderService.ResumeOrderAsync(id);
                return Ok(ApiResponse<OrderDto>.Ok(order));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }

        [HttpDelete]
        [Route("{id:int}")]
        public async Task<IHttpActionResult> Delete(int id)
        {
            try
            {
                var result = await _orderService.DeleteOrderAsync(id);
                if (!result)
                {
                    return Ok(ApiResponse.Fail("Order not found"));
                }
                var userId = AuthHelper.GetCurrentUserId();
                await _auditLogService.LogAsync(userId, "Delete", "Order", id, "Deleted hold order");
                return Ok(ApiResponse.Ok("Order deleted successfully"));
            }
            catch (Exception ex)
            {
                return Ok(ApiResponse.Fail(ex.Message));
            }
        }
    }
}
