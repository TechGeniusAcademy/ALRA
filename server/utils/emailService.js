const nodemailer = require('nodemailer');
require('dotenv').config();

// Создание транспорта для отправки писем
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD
  }
});

// Функция для отправки письма с подтверждением бронирования
const sendBookingConfirmation = async (booking, room) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: booking.clientEmail,
      subject: 'Подтверждение бронирования в ALRA Eco Village',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Подтверждение бронирования</h2>
          <p>Уважаемый(ая) ${booking.clientName},</p>
          <p>Благодарим вас за бронирование в ALRA Eco Village! Ниже приведены детали вашего бронирования:</p>
          
          <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Номер бронирования:</strong> #${booking.id}</p>
            <p><strong>Тип номера:</strong> ${room.title}</p>
            <p><strong>Дата заезда:</strong> ${new Date(booking.checkIn).toLocaleDateString('ru-RU')}</p>
            <p><strong>Дата выезда:</strong> ${new Date(booking.checkOut).toLocaleDateString('ru-RU')}</p>
            <p><strong>Количество гостей:</strong> ${booking.guests}</p>
            <p><strong>Общая стоимость:</strong> ${booking.totalPrice} ₽</p>
          </div>
          
          <p>Если у вас есть какие-либо вопросы или вам нужна дополнительная информация, не стесняйтесь обращаться к нам по телефону <strong>+7 (940) 717-99-88</strong> или ответьте на это письмо.</p>
          
          <p>С нетерпением ждем вашего приезда!</p>
          
          <p>С уважением,<br>Команда ALRA Eco Village</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Confirmation email sent to ${booking.clientEmail}`);
    return true;
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
    return false;
  }
};

// Функция для отправки письма с уведомлением о новом контактном сообщении
const sendContactNotification = async (contact) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: process.env.SMTP_USER, // Письмо отправляется администратору
      subject: 'Новое сообщение с формы контактов',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Новое сообщение с сайта</h2>
          
          <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Имя:</strong> ${contact.name}</p>
            <p><strong>Email:</strong> ${contact.email}</p>
            <p><strong>Тема:</strong> ${contact.subject}</p>
            <p><strong>Сообщение:</strong></p>
            <p style="white-space: pre-line;">${contact.message}</p>
            <p><strong>Дата:</strong> ${new Date(contact.createdAt).toLocaleString('ru-RU')}</p>
          </div>
          
          <p>Пожалуйста, ответьте на это сообщение как можно скорее.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Contact notification email sent to admin`);
    return true;
  } catch (error) {
    console.error('Error sending contact notification email:', error);
    return false;
  }
};

// Автоответ на контактное сообщение
const sendContactAutoReply = async (contact) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: contact.email,
      subject: 'Спасибо за ваше сообщение - ALRA Eco Village',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Спасибо за ваше сообщение!</h2>
          <p>Уважаемый(ая) ${contact.name},</p>
          <p>Мы получили ваше сообщение и благодарим вас за обращение. Наша команда рассмотрит его в ближайшее время и свяжется с вами, если потребуется дополнительная информация.</p>
          
          <p>С уважением,<br>Команда ALRA Eco Village</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Auto-reply email sent to ${contact.email}`);
    return true;
  } catch (error) {
    console.error('Error sending auto-reply email:', error);
    return false;
  }
};

module.exports = {
  sendBookingConfirmation,
  sendContactNotification,
  sendContactAutoReply
}; 