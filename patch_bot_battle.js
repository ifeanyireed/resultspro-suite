const fs = require('fs');

let content = fs.readFileSync('service_examspro/internal/api/handlers/battle.go', 'utf8');

// For CreateBotBattle
let searchBot = `			CreatorID:       &userID,
			StartedAt:       &now,
			Questions:       questions,
		}
		if err := tx.Create(battle).Error; err != nil {
			return err
		}`;

let replaceBot = `			CreatorID:       &userID,
			StartedAt:       &now,
		}
		if err := tx.Create(battle).Error; err != nil {
			return err
		}
		
		// Append to junction table without upserting Questions
		if err := tx.Model(battle).Association("Questions").Append(questions); err != nil {
			return err
		}`;

content = content.replace(searchBot, replaceBot);

// For initiateBattle
let searchMatch = `			Status:            "active",
			StartedAt:         &now,
			Questions:         questions, // GORM will handle the many-to-many link
		}
		if err := tx.Create(battle).Error; err != nil {
			return err
		}`;

let replaceMatch = `			Status:            "active",
			StartedAt:         &now,
		}
		if err := tx.Create(battle).Error; err != nil {
			return err
		}
		
		// Append to junction table without upserting Questions
		if err := tx.Model(battle).Association("Questions").Append(questions); err != nil {
			return err
		}`;

content = content.replace(searchMatch, replaceMatch);

fs.writeFileSync('service_examspro/internal/api/handlers/battle.go', content);
console.log("Patched battle.go");
