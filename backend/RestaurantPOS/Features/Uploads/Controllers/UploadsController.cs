using System;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;
using RestaurantPOS.Shared;

namespace RestaurantPOS.Features.Uploads.Controllers
{
    [RoutePrefix("api/v1/uploads")]
    public class UploadsController : ApiController
    {
        private static readonly string[] AllowedExtensions = { ".jpg", ".jpeg", ".png", ".webp" };
        private const long MaxFileSize = 2 * 1024 * 1024;

        [HttpPost]
        [Route("{folder}")]
        public async Task<IHttpActionResult> Upload(string folder)
        {
            if (!Request.Content.IsMimeMultipartContent())
                return BadRequest("Multipart content required");

            if (folder != "menu-items" && folder != "categories")
                return BadRequest("Invalid upload folder. Use 'menu-items' or 'categories'.");

            var uploadsPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "wwwroot", "uploads", folder);
            Directory.CreateDirectory(uploadsPath);

            var provider = new MultipartFormDataStreamProvider(Path.GetTempPath());

            try
            {
                await Request.Content.ReadAsMultipartAsync(provider);
            }
            catch (Exception ex)
            {
                return BadRequest("Failed to read upload: " + ex.Message);
            }

            if (provider.FileData.Count == 0)
                return BadRequest("No file uploaded");

            var file = provider.FileData[0];
            var originalName = Path.GetFileName(file.Headers.ContentDisposition.FileName.Trim('"'));
            var extension = Path.GetExtension(originalName).ToLowerInvariant();

            if (Array.IndexOf(AllowedExtensions, extension) < 0)
                return BadRequest("Only JPG, PNG, and WEBP files are allowed");

            var fileInfo = new FileInfo(file.LocalFileName);
            if (fileInfo.Length > MaxFileSize)
                return BadRequest("File size must be less than 2 MB");

            var fileName = $"{Guid.NewGuid()}{extension}";
            var destPath = Path.Combine(uploadsPath, fileName);
            File.Move(file.LocalFileName, destPath);

            var url = $"/uploads/{folder}/{fileName}";
            return Ok(ApiResponse<object>.Ok(new { url, fileName }, "File uploaded successfully"));
        }
    }
}
