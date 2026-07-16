using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace RestaurantPOS.Features.Customers
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _customerRepository;

        public CustomerService(ICustomerRepository customerRepository)
        {
            _customerRepository = customerRepository;
        }

        public async Task<IEnumerable<CustomerDto>> GetAllAsync()
        {
            var customers = await _customerRepository.GetAllAsync();
            return customers.Select(MapToDto);
        }

        public async Task<CustomerDto> GetByIdAsync(int id)
        {
            var customer = await _customerRepository.GetByIdAsync(id);
            if (customer == null) return null;
            return MapToDto(customer);
        }

        public async Task<CustomerDto> GetByPhoneAsync(string phone)
        {
            var customer = await _customerRepository.GetByPhoneAsync(phone);
            if (customer == null) return null;
            return MapToDto(customer);
        }

        public async Task<CustomerDto> CreateAsync(CreateCustomerDto dto)
        {
            if (!string.IsNullOrEmpty(dto.Phone))
            {
                var existingCustomer = await _customerRepository.GetByPhoneAsync(dto.Phone);
                if (existingCustomer != null)
                {
                    existingCustomer.Name = dto.Name;
                    existingCustomer.Address = dto.Address;
                    existingCustomer.Notes = dto.Notes;
                    existingCustomer.UpdatedAt = DateTime.Now;
                    await _customerRepository.UpdateAsync(existingCustomer);
                    return MapToDto(existingCustomer);
                }
            }

            var customer = new Customer
            {
                Name = dto.Name,
                Phone = dto.Phone,
                Address = dto.Address,
                Notes = dto.Notes,
                CreatedAt = DateTime.Now
            };

            var id = await _customerRepository.CreateAsync(customer);
            customer.Id = id;

            return MapToDto(customer);
        }

        public async Task<CustomerDto> UpdateAsync(int id, UpdateCustomerDto dto)
        {
            var existingCustomer = await _customerRepository.GetByIdAsync(id);
            if (existingCustomer == null)
            {
                throw new Exception("Customer not found");
            }

            if (!string.IsNullOrEmpty(dto.Phone))
            {
                var duplicateCustomer = await _customerRepository.GetByPhoneAsync(dto.Phone);
                if (duplicateCustomer != null && duplicateCustomer.Id != id)
                {
                    throw new Exception("Phone number already exists");
                }
            }

            existingCustomer.Name = dto.Name;
            existingCustomer.Phone = dto.Phone;
            existingCustomer.Address = dto.Address;
            existingCustomer.Notes = dto.Notes;
            existingCustomer.UpdatedAt = DateTime.Now;

            await _customerRepository.UpdateAsync(existingCustomer);

            return MapToDto(existingCustomer);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var customer = await _customerRepository.GetByIdAsync(id);
            if (customer == null)
            {
                throw new Exception("Customer not found");
            }

            return await _customerRepository.DeleteAsync(id);
        }

        private CustomerDto MapToDto(Customer customer)
        {
            return new CustomerDto
            {
                Id = customer.Id,
                Name = customer.Name,
                Phone = customer.Phone,
                Address = customer.Address,
                Notes = customer.Notes
            };
        }
    }
}
