package main

import (
	"fmt"
	"io/ioutil"
	"strings"
)

func main() {
	content, _ := ioutil.ReadFile("service_users/handlers/blog.go")
	strContent := string(content)

	// 1. Add Tags to input struct in HandleCreatePost
	strContent = strings.Replace(strContent, "Status     string  `json:\"status\"`\n	}", "Status     string  `json:\"status\"`\n		Tags       string  `json:\"tags\"`\n	}", 1)

	// 2. Add Tags to input struct in HandleUpdatePost
	strContent = strings.Replace(strContent, "Status     string  `json:\"status\"`\n	}", "Status     string  `json:\"status\"`\n		Tags       string  `json:\"tags\"`\n	}", -1)

	// We need to write the tag sync logic!
	tagLogic := `
func syncTags(postID string, tagsStr string) {
	if tagsStr == "" {
		db.GormDB.Exec("DELETE FROM blog_post_tags WHERE post_id = ?", postID)
		return
	}
	db.GormDB.Exec("DELETE FROM blog_post_tags WHERE post_id = ?", postID)
	tags := strings.Split(tagsStr, ",")
	for _, t := range tags {
		t = strings.TrimSpace(t)
		if t == "" { continue }
		slug := strings.ToLower(strings.ReplaceAll(t, " ", "-"))
		var tag models.BlogTag
		if err := db.GormDB.Where("slug = ?", slug).First(&tag).Error; err != nil {
			tag = models.BlogTag{ID: generateID("tag"), Name: t, Slug: slug}
			db.GormDB.Create(&tag)
		}
		db.GormDB.Exec("INSERT INTO blog_post_tags (post_id, tag_id) VALUES (?, ?)", postID, tag.ID)
	}
}

func loadTags(posts []models.BlogPost) []models.BlogPost {
	for i, p := range posts {
		var tags []string
		db.GormDB.Raw("SELECT t.name FROM blog_tags t JOIN blog_post_tags pt ON t.id = pt.tag_id WHERE pt.post_id = ?", p.ID).Scan(&tags)
		posts[i].Tags = strings.Join(tags, ", ")
	}
	return posts
}
`
	if !strings.Contains(strContent, "func syncTags") {
		strContent = strContent + tagLogic
	}

	// 3. Update HandleCreatePost logic
	strContent = strings.Replace(strContent, "utils.JSONResponse(w, http.StatusCreated, post)\n}", "syncTags(post.ID, input.Tags)\n	post.Tags = input.Tags\n	utils.JSONResponse(w, http.StatusCreated, post)\n}", 1)

	// 4. Update HandleUpdatePost logic
	strContent = strings.Replace(strContent, "utils.JSONResponse(w, http.StatusOK, post)\n}", "syncTags(post.ID, input.Tags)\n	post.Tags = input.Tags\n	utils.JSONResponse(w, http.StatusOK, post)\n}", 1)

	// 5. Update HandleGetPosts logic
	strContent = strings.Replace(strContent, "utils.JSONResponse(w, http.StatusOK, posts)", "posts = loadTags(posts)\n	utils.JSONResponse(w, http.StatusOK, posts)", 1)

	ioutil.WriteFile("service_users/handlers/blog.go", []byte(strContent), 0644)
	fmt.Println("Done")
}
