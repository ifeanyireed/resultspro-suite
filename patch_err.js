const fs = require('fs');
let content = fs.readFileSync('service_examspro/internal/api/handlers/battle.go', 'utf8');

content = content.replace(
  `	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create bot battle"})
		return
	}`,
  `	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create bot battle", "details": err.Error()})
		return
	}`
);

fs.writeFileSync('service_examspro/internal/api/handlers/battle.go', content);
