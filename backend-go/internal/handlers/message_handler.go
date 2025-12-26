package handlers

import (
	"backend-go/internal/models"
	"backend-go/internal/services"
	"backend-go/internal/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type MessageHandler struct {
	service services.MessageService
}

func NewMessageHandler(service services.MessageService) *MessageHandler {
	return &MessageHandler{service}
}

// SubmitMessage godoc
// @Summary      Submit a contact message
// @Description  Submit a new message from contact form
// @Tags         messages
// @Accept       json
// @Produce      json
// @Param        message  body      models.Message  true  "Message Data"
// @Success      201      {object}  utils.APIResponse
// @Failure      400      {object}  utils.APIResponse
// @Router       /contact [post]
func (h *MessageHandler) SubmitMessage(c *gin.Context) {
	var input models.Message
	if err := c.ShouldBindJSON(&input); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid input", err.Error())
		return
	}

	if err := h.service.CreateMessage(&input); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to send message", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusCreated, "Message sent successfully", nil)
}

func (h *MessageHandler) GetAllMessages(c *gin.Context) {
	messages, err := h.service.GetAllMessages()
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to fetch messages", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Messages fetched successfully", messages)
}

func (h *MessageHandler) DeleteMessage(c *gin.Context) {
	idStr := c.Param("id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid ID", err.Error())
		return
	}

	if err := h.service.DeleteMessage(uint(id)); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to delete message", err.Error())
		return
	}

	utils.SuccessResponse(c, http.StatusOK, "Message deleted successfully", nil)
}
