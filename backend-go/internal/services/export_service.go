package services

import (
	"backend-go/internal/models"
	"backend-go/internal/repository"
	"bytes"
	"context"
	"fmt"

	"github.com/xuri/excelize/v2"
)

type ExportService interface {
	ExportSantriToExcel(ctx context.Context, status string) (*bytes.Buffer, error)
}

type exportService struct {
	santriRepo repository.SantriRepository
}

func NewExportService(santriRepo repository.SantriRepository) ExportService {
	return &exportService{santriRepo}
}

func (s *exportService) ExportSantriToExcel(ctx context.Context, status string) (*bytes.Buffer, error) {
	var santris []models.Santri
	var err error

	if status != "" {
		santris, err = s.santriRepo.FindByStatus(ctx, models.SantriStatus(status))
	} else {
		santris, err = s.santriRepo.FindAll(ctx)
	}

	if err != nil {
		return nil, err
	}

	f := excelize.NewFile()
	sheetName := "Data Santri"
	f.SetSheetName("Sheet1", sheetName)

	// Set headers
	headers := []string{
		"No", "Nama Lengkap", "NIK", "Tempat Lahir", "Tanggal Lahir",
		"Jenis Kelamin", "Alamat", "Nama Orang Tua", "No. HP Orang Tua",
		"NIS", "Kelas", "Tahun Masuk", "Status", "Tanggal Daftar",
	}

	headerStyle, _ := f.NewStyle(&excelize.Style{
		Font:      &excelize.Font{Bold: true, Color: "#FFFFFF"},
		Fill:      excelize.Fill{Type: "pattern", Color: []string{"#4472C4"}, Pattern: 1},
		Alignment: &excelize.Alignment{Horizontal: "center", Vertical: "center"},
		Border: []excelize.Border{
			{Type: "left", Color: "#000000", Style: 1},
			{Type: "right", Color: "#000000", Style: 1},
			{Type: "top", Color: "#000000", Style: 1},
			{Type: "bottom", Color: "#000000", Style: 1},
		},
	})

	for i, header := range headers {
		cell, _ := excelize.CoordinatesToCellName(i+1, 1)
		f.SetCellValue(sheetName, cell, header)
		f.SetCellStyle(sheetName, cell, cell, headerStyle)
	}

	// Set column widths
	f.SetColWidth(sheetName, "A", "A", 5)
	f.SetColWidth(sheetName, "B", "B", 25)
	f.SetColWidth(sheetName, "C", "C", 18)
	f.SetColWidth(sheetName, "D", "D", 15)
	f.SetColWidth(sheetName, "E", "E", 15)
	f.SetColWidth(sheetName, "F", "F", 12)
	f.SetColWidth(sheetName, "G", "G", 30)
	f.SetColWidth(sheetName, "H", "H", 20)
	f.SetColWidth(sheetName, "I", "I", 15)
	f.SetColWidth(sheetName, "J", "J", 12)
	f.SetColWidth(sheetName, "K", "K", 10)
	f.SetColWidth(sheetName, "L", "L", 12)
	f.SetColWidth(sheetName, "M", "M", 12)
	f.SetColWidth(sheetName, "N", "N", 18)

	// Data style
	dataStyle, _ := f.NewStyle(&excelize.Style{
		Border: []excelize.Border{
			{Type: "left", Color: "#000000", Style: 1},
			{Type: "right", Color: "#000000", Style: 1},
			{Type: "top", Color: "#000000", Style: 1},
			{Type: "bottom", Color: "#000000", Style: 1},
		},
	})

	// Fill data
	for i, santri := range santris {
		row := i + 2
		genderLabel := "Laki-laki"
		if santri.Gender == "P" {
			genderLabel = "Perempuan"
		}

		data := []interface{}{
			i + 1,
			santri.FullName,
			santri.NIK,
			santri.BirthPlace,
			santri.BirthDate.Format("02-01-2006"),
			genderLabel,
			santri.Address,
			santri.ParentName,
			santri.ParentPhone,
			santri.NIS,
			santri.Class,
			santri.EntryYear,
			string(santri.Status),
			santri.CreatedAt.Format("02-01-2006 15:04"),
		}

		for j, value := range data {
			cell, _ := excelize.CoordinatesToCellName(j+1, row)
			f.SetCellValue(sheetName, cell, value)
			f.SetCellStyle(sheetName, cell, cell, dataStyle)
		}
	}

	// Add summary row
	summaryRow := len(santris) + 3
	f.SetCellValue(sheetName, fmt.Sprintf("A%d", summaryRow), fmt.Sprintf("Total: %d santri", len(santris)))

	// Write to buffer
	buf := new(bytes.Buffer)
	if err := f.Write(buf); err != nil {
		return nil, err
	}

	return buf, nil
}
