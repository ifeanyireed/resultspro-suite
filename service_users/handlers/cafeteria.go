package handlers

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"service_users.resultspro.ng/db"
	"service_users.resultspro.ng/utils"
)

// HandleCampusCafeteria handles student cashless wallets, tuck shop POS transactions, and menus
func HandleCampusCafeteria(w http.ResponseWriter, r *http.Request) {
	tenantID := resolveHandlerTenantID(r)
	if tenantID == "" {
		utils.JSONError(w, http.StatusBadRequest, "Tenant context required")
		return
	}

	switch r.Method {
	case http.MethodGet:
		var activeWallets int
		var totalBalance, todaySales float64
		_ = db.DB.QueryRow(`SELECT COUNT(*) FROM campus_cafeteria_wallets WHERE tenant_id = ? AND status = 'ACTIVE'`, tenantID).Scan(&activeWallets)
		_ = db.DB.QueryRow(`SELECT COALESCE(SUM(balance), 0) FROM campus_cafeteria_wallets WHERE tenant_id = ?`, tenantID).Scan(&totalBalance)
		_ = db.DB.QueryRow(`SELECT COALESCE(SUM(amount), 0) FROM campus_cafeteria_transactions WHERE tenant_id = ? AND transaction_type = 'PURCHASE' AND DATE(created_at) = CURRENT_DATE`, tenantID).Scan(&todaySales)

		walletRows, err := db.DB.Query(`
			SELECT id, tenant_id, student_id, student_name, class_name, COALESCE(card_rfid, ''),
			       balance, daily_limit, status, last_top_up_amount, COALESCE(last_top_up_date, ''), updated_at
			FROM campus_cafeteria_wallets
			WHERE tenant_id = ?
			ORDER BY student_name ASC LIMIT 100`, tenantID)
		wallets := []map[string]interface{}{}
		if err == nil {
			defer walletRows.Close()
			for walletRows.Next() {
				var id, tID, stuID, stuName, cls, rfid, status, lastDate string
				var bal, limit, lastTopUp float64
				var updatedAt time.Time
				if err := walletRows.Scan(&id, &tID, &stuID, &stuName, &cls, &rfid, &bal, &limit, &status, &lastTopUp, &lastDate, &updatedAt); err == nil {
					wallets = append(wallets, map[string]interface{}{
						"id":                 id,
						"tenant_id":          tID,
						"student_id":         stuID,
						"student_name":       stuName,
						"class_name":         cls,
						"card_rfid":          rfid,
						"balance":            bal,
						"daily_limit":        limit,
						"status":             status,
						"last_top_up_amount": lastTopUp,
						"last_top_up_date":   lastDate,
						"updated_at":         updatedAt.Format("2006-01-02 15:04"),
					})
				}
			}
		}

		txRows, err := db.DB.Query(`
			SELECT id, tenant_id, wallet_id, student_id, student_name, transaction_type,
			       amount, balance_after, description, cashier_name, created_at
			FROM campus_cafeteria_transactions
			WHERE tenant_id = ?
			ORDER BY created_at DESC LIMIT 100`, tenantID)
		transactions := []map[string]interface{}{}
		if err == nil {
			defer txRows.Close()
			for txRows.Next() {
				var id, tID, wID, stuID, stuName, txType, desc, cashier string
				var amount, balAfter float64
				var createdAt time.Time
				if err := txRows.Scan(&id, &tID, &wID, &stuID, &stuName, &txType, &amount, &balAfter, &desc, &cashier, &createdAt); err == nil {
					transactions = append(transactions, map[string]interface{}{
						"id":               id,
						"tenant_id":        tID,
						"wallet_id":        wID,
						"student_id":       stuID,
						"student_name":     stuName,
						"transaction_type": txType,
						"amount":           amount,
						"balance_after":    balAfter,
						"description":      desc,
						"cashier_name":     cashier,
						"created_at":       createdAt.Format("2006-01-02 15:04"),
					})
				}
			}
		}

		menuRows, err := db.DB.Query(`
			SELECT id, tenant_id, day_of_week, meal_time, menu_items, allergens, calorie_estimate
			FROM campus_cafeteria_menus
			WHERE tenant_id = ?
			ORDER BY id ASC LIMIT 20`, tenantID)
		menus := []map[string]interface{}{}
		if err == nil {
			defer menuRows.Close()
			for menuRows.Next() {
				var id, tID, day, mTime, items, allergens, cal string
				if err := menuRows.Scan(&id, &tID, &day, &mTime, &items, &allergens, &cal); err == nil {
					menus = append(menus, map[string]interface{}{
						"id":               id,
						"tenant_id":        tID,
						"day_of_week":      day,
						"meal_time":        mTime,
						"menu_items":       items,
						"allergens":        allergens,
						"calorie_estimate": cal,
					})
				}
			}
		}

		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{
			"success": true,
			"summary": map[string]interface{}{
				"active_wallets":   activeWallets,
				"total_balance":    totalBalance,
				"today_pos_sales":  todaySales,
				"scheduled_menus":  len(menus),
			},
			"wallets":      wallets,
			"transactions": transactions,
			"menus":        menus,
		})

	case http.MethodPost:
		var payload map[string]interface{}
		if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
			utils.JSONError(w, http.StatusBadRequest, "Invalid JSON payload")
			return
		}

		action, _ := payload["action"].(string)
		if action == "" {
			action = "topup_wallet"
		}

		switch action {
		case "create_wallet":
			stuID, _ := payload["student_id"].(string)
			stuName, _ := payload["student_name"].(string)
			cls, _ := payload["class_name"].(string)
			rfid, _ := payload["card_rfid"].(string)
			limit, _ := payload["daily_limit"].(float64)

			if stuName == "" {
				utils.JSONError(w, http.StatusBadRequest, "Student name is required")
				return
			}
			if limit == 0 {
				limit = 2500
			}
			if stuID == "" {
				stuID = "STU-" + uuid.New().String()[:6]
			}
			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_cafeteria_wallets (
					id, tenant_id, student_id, student_name, class_name, card_rfid,
					balance, daily_limit, status
				) VALUES (?, ?, ?, ?, ?, ?, 0, ?, 'ACTIVE')`,
				id, tenantID, stuID, stuName, cls, rfid, limit,
			)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Failed to create wallet: "+err.Error())
				return
			}
			utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "message": "Student campus wallet created"})

		case "topup_wallet":
			walletID, _ := payload["wallet_id"].(string)
			amount, _ := payload["amount"].(float64)
			desc, _ := payload["description"].(string)

			if walletID == "" || amount <= 0 {
				utils.JSONError(w, http.StatusBadRequest, "Valid wallet ID and amount required")
				return
			}
			if desc == "" {
				desc = "Wallet Top-Up via Bursary / Parent Portal"
			}

			var curBal float64
			var stuID, stuName string
			err := db.DB.QueryRow(`SELECT balance, student_id, student_name FROM campus_cafeteria_wallets WHERE id = ? AND tenant_id = ?`, walletID, tenantID).Scan(&curBal, &stuID, &stuName)
			if err != nil {
				utils.JSONError(w, http.StatusNotFound, "Wallet not found")
				return
			}

			newBal := curBal + amount
			nowDate := time.Now().Format("2006-01-02 15:04")
			_, _ = db.DB.Exec(`UPDATE campus_cafeteria_wallets SET balance = ?, last_top_up_amount = ?, last_top_up_date = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?`, newBal, amount, nowDate, walletID, tenantID)

			txID := uuid.New().String()
			_, _ = db.DB.Exec(`
				INSERT INTO campus_cafeteria_transactions (
					id, tenant_id, wallet_id, student_id, student_name, transaction_type,
					amount, balance_after, description, cashier_name
				) VALUES (?, ?, ?, ?, ?, 'TOP_UP', ?, ?, ?, 'Bursary Admin')`,
				txID, tenantID, walletID, stuID, stuName, amount, newBal, desc,
			)
			utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "new_balance": newBal, "message": "Wallet top-up successful"})

		case "record_pos_transaction":
			walletID, _ := payload["wallet_id"].(string)
			amount, _ := payload["amount"].(float64)
			desc, _ := payload["description"].(string)
			cashier, _ := payload["cashier_name"].(string)

			if walletID == "" || amount <= 0 || desc == "" {
				utils.JSONError(w, http.StatusBadRequest, "Wallet ID, positive amount, and item description required")
				return
			}
			if cashier == "" {
				cashier = "Tuck Shop Point-of-Sale"
			}

			var curBal, dailyLimit float64
			var stuID, stuName string
			err := db.DB.QueryRow(`SELECT balance, daily_limit, student_id, student_name FROM campus_cafeteria_wallets WHERE id = ? AND tenant_id = ?`, walletID, tenantID).Scan(&curBal, &dailyLimit, &stuID, &stuName)
			if err != nil {
				utils.JSONError(w, http.StatusNotFound, "Wallet not found")
				return
			}

			if curBal < amount {
				utils.JSONError(w, http.StatusBadRequest, "Insufficient wallet balance")
				return
			}

			newBal := curBal - amount
			_, _ = db.DB.Exec(`UPDATE campus_cafeteria_wallets SET balance = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND tenant_id = ?`, newBal, walletID, tenantID)

			txID := uuid.New().String()
			_, _ = db.DB.Exec(`
				INSERT INTO campus_cafeteria_transactions (
					id, tenant_id, wallet_id, student_id, student_name, transaction_type,
					amount, balance_after, description, cashier_name
				) VALUES (?, ?, ?, ?, ?, 'PURCHASE', ?, ?, ?, ?)`,
				txID, tenantID, walletID, stuID, stuName, amount, newBal, desc, cashier,
			)
			utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "new_balance": newBal, "message": "Purchase completed"})

		case "save_menu":
			day, _ := payload["day_of_week"].(string)
			mTime, _ := payload["meal_time"].(string)
			items, _ := payload["menu_items"].(string)
			allergens, _ := payload["allergens"].(string)
			cal, _ := payload["calorie_estimate"].(string)

			if day == "" || items == "" {
				utils.JSONError(w, http.StatusBadRequest, "Day and menu items are required")
				return
			}
			if mTime == "" {
				mTime = "LUNCH"
			}
			id := uuid.New().String()
			_, err := db.DB.Exec(`
				INSERT INTO campus_cafeteria_menus (
					id, tenant_id, day_of_week, meal_time, menu_items, allergens, calorie_estimate
				) VALUES (?, ?, ?, ?, ?, ?, ?)`,
				id, tenantID, day, mTime, items, allergens, cal,
			)
			if err != nil {
				utils.JSONError(w, http.StatusInternalServerError, "Failed to save menu: "+err.Error())
				return
			}
			utils.JSONResponse(w, http.StatusCreated, map[string]interface{}{"success": true, "id": id, "message": "Meal menu scheduled"})
		}

	case http.MethodDelete:
		id := r.URL.Query().Get("id")
		if id == "" {
			utils.JSONError(w, http.StatusBadRequest, "Record ID is required")
			return
		}
		_, _ = db.DB.Exec("DELETE FROM campus_cafeteria_menus WHERE id = ? AND tenant_id = ?", id, tenantID)
		utils.JSONResponse(w, http.StatusOK, map[string]interface{}{"success": true, "message": "Menu item deleted"})

	default:
		utils.JSONError(w, http.StatusMethodNotAllowed, "Method not allowed")
	}
}
