package models

import (
	"time"

	"gorm.io/gorm"
)

type Exam struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID        int            `gorm:"primaryKey;autoIncrement" json:"id"`
	Name      string         `json:"name"`
	Slug      string         `gorm:"uniqueIndex" json:"slug"`
	Category  string         `json:"category"`
	YearRange string         `json:"yearRange"`
	ExamDate  *time.Time     `json:"examDate"`
	IsPopular bool           `gorm:"default:false" json:"isPopular"`
	IsCurated bool           `gorm:"default:false" json:"isCurated"`
	IsActive  bool           `gorm:"default:true" json:"isActive"`
	IsBattleReady bool       `gorm:"default:false" json:"isBattleReady"`
	Subjects  []Subject      `json:"subjects,omitempty"`
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`
}

type Subject struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID             int            `gorm:"primaryKey;autoIncrement" json:"id"`
	ExamID         int            `gorm:"index" json:"examId"`
	Exam           *Exam          `json:"exam,omitempty"`
	Name           string         `json:"name"`
	Slug           string         `json:"slug"`
	CoinUnlockCost int            `gorm:"default:0" json:"coinUnlockCost"`
	Color          string         `gorm:"default:'blue'" json:"color"`
	TextbookURL    *string        `json:"textbookUrl"`
	TextbookTitle  *string        `json:"textbookTitle"`
	TextbookContent *string       `json:"textbookContent" gorm:"type:text"`
	Topics         []Topic        `json:"topics,omitempty"`
	CreatedAt      time.Time      `json:"createdAt"`
	UpdatedAt      time.Time      `json:"updatedAt"`
	DeletedAt      gorm.DeletedAt `gorm:"index" json:"-"`
}

type Topic struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID              int            `gorm:"primaryKey;autoIncrement" json:"id"`
	SubjectID       int            `gorm:"index" json:"subjectId"`
	Subject         *Subject       `json:"subject,omitempty"`
	Name            string         `json:"name"`
	OrderIndex      int            `json:"orderIndex"`
	SyllabusContent *string        `json:"syllabusContent"`
	AiLessonNotes   *string        `json:"aiLessonNotes"`
	Questions       []Question     `json:"questions,omitempty"`
	CreatedAt       time.Time      `json:"createdAt"`
	UpdatedAt       time.Time      `json:"updatedAt"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`
}

type Question struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID                  string           `gorm:"primaryKey;type:varchar(191)" json:"id"`
	TopicID             int              `gorm:"index" json:"topicId"`
	Topic               *Topic           `json:"topic,omitempty"`
	Type                string           `json:"type"` // 'mcq','truefalse','fill','theory','practical','image','matching'
	BodyText            string           `json:"bodyText"`
	BodyImageUrl        *string          `json:"bodyImageUrl"`
	Difficulty          string           `json:"difficulty"` // 'easy','medium','hard'
	Year                *int             `json:"year"`
	CoinReward          int              `gorm:"default:1" json:"coinReward"`
	Status              string           `gorm:"default:'draft'" json:"status"` // 'draft','published','archived'
	ExplanationStandard *string          `json:"explanationStandard"`
	Options             []QuestionOption `json:"options,omitempty"`
	CreatedAt           time.Time        `json:"createdAt"`
	UpdatedAt           time.Time        `json:"updatedAt"`
	DeletedAt           gorm.DeletedAt   `gorm:"index" json:"-"`
}

type QuestionOption struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID         string         `gorm:"primaryKey;type:varchar(191)" json:"id"`
	QuestionID string         `gorm:"index" json:"questionId"`
	Question   *Question      `json:"question,omitempty"`
	OptionText string         `json:"optionText"`
	IsCorrect  bool           `gorm:"default:false" json:"isCorrect,omitempty"`
	OrderIndex int            `json:"orderIndex"` // 0=A, 1=B, 2=C, 3=D
	CreatedAt  time.Time      `json:"createdAt"`
	UpdatedAt  time.Time      `json:"updatedAt"`
	DeletedAt  gorm.DeletedAt `gorm:"index" json:"-"`
}

type UserAnswer struct {
	TenantID string `gorm:"size:64;index" json:"tenant_id"`
	ID               string         `gorm:"primaryKey;type:varchar(191)" json:"id"`
	UserID           string         `gorm:"index" json:"userId"`
	User             *User          `json:"user,omitempty"`
	QuestionID       string         `gorm:"index" json:"questionId"`
	Question         *Question      `json:"question,omitempty"`
	SelectedOptionID *string        `json:"selectedOptionId"`
	TextAnswer       *string        `json:"textAnswer"`
	IsCorrect        bool           `json:"isCorrect"`
	CoinsEarned      int            `gorm:"default:0" json:"coinsEarned"`
	TimeTakenMs      int            `json:"timeTakenMs"`
	SessionID        string         `json:"sessionId"`
	AnsweredAt       time.Time      `json:"answeredAt"`
	DeletedAt        gorm.DeletedAt `gorm:"index" json:"-"`
}

func (Exam) TableName() string {
	return "nat_exams_exams"
}

func (Subject) TableName() string {
	return "nat_exams_subjects"
}

func (Topic) TableName() string {
	return "nat_exams_topics"
}

func (Question) TableName() string {
	return "nat_exams_questions"
}

func (QuestionOption) TableName() string {
	return "nat_exams_question_options"
}

func (UserAnswer) TableName() string {
	return "nat_exams_user_answers"
}
