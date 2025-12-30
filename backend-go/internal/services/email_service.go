package services

import (
	"backend-go/config"
	"backend-go/internal/logger"
	"crypto/tls"
	"fmt"

	"go.uber.org/zap"
	"gopkg.in/gomail.v2"
)

type EmailService interface {
	SendPSBConfirmation(to, santriName, registrationID string) error
	SendStatusUpdate(to, santriName, status string) error
	SendWelcomeAdmin(to, username, tempPassword string) error
	SendGenericEmail(to, subject, body string) error
}

type emailService struct {
	dialer *gomail.Dialer
	from   string
}

func NewEmailService() EmailService {
	smtpHost := config.AppConfig.SMTPHost
	smtpPort := config.AppConfig.SMTPPort
	smtpUser := config.AppConfig.SMTPUser
	smtpPass := config.AppConfig.SMTPPass
	smtpFrom := config.AppConfig.SMTPFrom

	// If no SMTP config, return a no-op service
	if smtpHost == "" || smtpUser == "" {
		logger.Warn("SMTP not configured, email service will be disabled")
		return &noopEmailService{}
	}

	d := gomail.NewDialer(smtpHost, smtpPort, smtpUser, smtpPass)
	d.TLSConfig = &tls.Config{InsecureSkipVerify: true}

	return &emailService{
		dialer: d,
		from:   smtpFrom,
	}
}

func (s *emailService) SendPSBConfirmation(to, santriName, registrationID string) error {
	subject := "Konfirmasi Pendaftaran PSB Pondok Pesantren K3 Arafah"
	body := fmt.Sprintf(`
<html>
<body>
	<h2>Assalamu'alaikum Warahmatullahi Wabarakatuh</h2>
	<p>Terima kasih telah mendaftarkan <strong>%s</strong> di Pondok Pesantren K3 Arafah.</p>
	<p>Nomor Registrasi: <strong>%s</strong></p>
	<p>Status pendaftaran saat ini: <strong>PENDING</strong></p>
	<p>Kami akan menghubungi Anda setelah proses verifikasi selesai.</p>
	<br>
	<p>Wassalamu'alaikum Warahmatullahi Wabarakatuh</p>
	<p><em>Tim PSB Pondok Pesantren K3 Arafah</em></p>
</body>
</html>
`, santriName, registrationID)

	return s.SendGenericEmail(to, subject, body)
}

func (s *emailService) SendStatusUpdate(to, santriName, status string) error {
	statusLabel := map[string]string{
		"PENDING":  "Menunggu Verifikasi",
		"VERIFIED": "Terverifikasi",
		"ACCEPTED": "Diterima",
		"REJECTED": "Ditolak",
	}

	subject := fmt.Sprintf("Update Status Pendaftaran PSB - %s", santriName)
	body := fmt.Sprintf(`
<html>
<body>
	<h2>Assalamu'alaikum Warahmatullahi Wabarakatuh</h2>
	<p>Status pendaftaran <strong>%s</strong> telah diperbarui.</p>
	<p>Status terbaru: <strong>%s</strong></p>
	<br>
	<p>Untuk informasi lebih lanjut, silakan hubungi kami.</p>
	<br>
	<p>Wassalamu'alaikum Warahmatullahi Wabarakatuh</p>
	<p><em>Tim PSB Pondok Pesantren K3 Arafah</em></p>
</body>
</html>
`, santriName, statusLabel[status])

	return s.SendGenericEmail(to, subject, body)
}

func (s *emailService) SendWelcomeAdmin(to, username, tempPassword string) error {
	subject := "Akun Admin Pondok Pesantren K3 Arafah"
	body := fmt.Sprintf(`
<html>
<body>
	<h2>Selamat Datang!</h2>
	<p>Akun admin Anda telah dibuat.</p>
	<p>Username: <strong>%s</strong></p>
	<p>Password: <strong>%s</strong></p>
	<br>
	<p><strong>Harap segera ganti password Anda setelah login pertama.</strong></p>
	<br>
	<p><em>Tim IT Pondok Pesantren K3 Arafah</em></p>
</body>
</html>
`, username, tempPassword)

	return s.SendGenericEmail(to, subject, body)
}

func (s *emailService) SendGenericEmail(to, subject, body string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", s.from)
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", body)

	if err := s.dialer.DialAndSend(m); err != nil {
		logger.Error("Failed to send email", zap.String("to", to), zap.Error(err))
		return err
	}

	logger.Info("Email sent successfully", zap.String("to", to), zap.String("subject", subject))
	return nil
}

// noopEmailService is a no-op implementation when SMTP is not configured
type noopEmailService struct{}

func (s *noopEmailService) SendPSBConfirmation(to, santriName, registrationID string) error {
	logger.Info("Email service disabled - would send PSB confirmation", zap.String("to", to))
	return nil
}

func (s *noopEmailService) SendStatusUpdate(to, santriName, status string) error {
	logger.Info("Email service disabled - would send status update", zap.String("to", to))
	return nil
}

func (s *noopEmailService) SendWelcomeAdmin(to, username, tempPassword string) error {
	logger.Info("Email service disabled - would send welcome admin", zap.String("to", to))
	return nil
}

func (s *noopEmailService) SendGenericEmail(to, subject, body string) error {
	logger.Info("Email service disabled - would send generic email", zap.String("to", to))
	return nil
}
