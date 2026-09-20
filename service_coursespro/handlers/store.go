package handlers

import (
	"net/http"
	"service_coursespro/db"
	"service_coursespro/models"

	"github.com/gin-gonic/gin"
)

// Admin List Store Products
func (h *Handler) AdminGetStoreProducts(c *gin.Context) {
	var products []models.StoreProduct
	if err := db.WithTenant(c).Order("created_at desc").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch products"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"products": products})
}

// Admin Create Store Product
func (h *Handler) AdminCreateStoreProduct(c *gin.Context) {
	tenantID, exists := c.Get("tenant_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Tenant missing"})
		return
	}

	var req models.StoreProduct
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request payload"})
		return
	}

	req.TenantID = tenantID.(string)

	if err := db.DB.Create(&req).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"product": req})
}

// Admin Update Store Product
func (h *Handler) AdminUpdateStoreProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.StoreProduct
	if err := db.WithTenant(c).Where("id = ?", id).First(&product).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	var req models.StoreProduct
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid payload"})
		return
	}

	product.Title = req.Title
	product.Description = req.Description
	product.ProductType = req.ProductType
	product.Price = req.Price
	product.CoverImage = req.CoverImage
	product.FileUrl = req.FileUrl
	product.IsPublished = req.IsPublished

	if err := db.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update product"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"product": product})
}

// Admin Delete Store Product
func (h *Handler) AdminDeleteStoreProduct(c *gin.Context) {
	id := c.Param("id")
	if err := db.WithTenant(c).Where("id = ?", id).Delete(&models.StoreProduct{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete product"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Product deleted successfully"})
}

// Public List Store Products (only published ones)
func (h *Handler) PublicGetStoreProducts(c *gin.Context) {
	tenantID := c.Query("tenant_id") // Pass tenant_id in query for public endpoints
	if tenantID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing tenant_id"})
		return
	}

	var products []models.StoreProduct
	if err := db.DB.Where("tenant_id = ? AND is_published = ?", tenantID, true).Order("created_at desc").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch store products"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"products": products})
}

// Public Get Single Store Product
func (h *Handler) PublicGetStoreProduct(c *gin.Context) {
	id := c.Param("id")
	tenantID := c.Query("tenant_id")
	if tenantID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing tenant_id"})
		return
	}

	var product models.StoreProduct
	if err := db.DB.Where("id = ? AND tenant_id = ? AND is_published = ?", id, tenantID, true).First(&product).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"product": product})
}
