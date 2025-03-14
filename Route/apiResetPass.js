const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json()); 
let router = express.Router();
const tokenStore = new Map();
const crypto = require('crypto'); 
const user = require('../Model/user')
const history = require('../Model/history')
router.post('/send-reset-password-link', async (req, res) => {
  try {
    const email = req.body.email;
    const checkEmail = await user.findOne({email:email})
    if (!checkEmail) {
      return res.status(205).json({ message: 'Email chưa đăng kí tài khoản !!!' });
    }
    const token = crypto.randomBytes(20).toString('hex');
    tokenStore.set(token, email);
    const resetLink = `http://localhost:3001/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({  
      service: 'gmail',
      auth: {
      user: 'vanthuan562004@gmail.com',
      pass: 'jsun tpst cgjl afko'
    }
    });
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Đổi mật khẩu của bạn',
      text: `Vui lòng nhấp vào liên kết sau để đổi mật khẩu: ${resetLink}`,
      html: `<p>Vui lòng nhấp vào liên kết sau để đổi mật khẩu:</p>
             <a href="${resetLink}">${resetLink}</a>`
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Liên kết đổi mật khẩu đã được gửi.' });
  } catch (error) {
    console.error('Lỗi khi gửi email:', error);
    return res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại.' });
  }
});
/////gui mail khi dat hang thanh cong
router.post('/cash-success', async (req, res) => {
  try {
    const { email, id, toTal } = req.body;

    const checkEmail = await user.findOne({ email });
    if (!checkEmail) {
      return res.status(205).json({ message: 'Email chưa đăng kí tài khoản !!!' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'vanthuan562004@gmail.com',
        pass: 'jsun tpst cgjl afko' 
      }
    });
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Xác nhận đơn hàng thành công',
      html: `
        <p>Chào bạn,</p>
        <p>Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi!</p>
        <p>Thông tin đơn hàng của bạn:</p>
        <ul>
          <li><strong>Mã đơn hàng:</strong> ${id}</li>
          <li><strong>Tổng tiền:</strong> ${toTal} VNĐ</li>
        </ul>
        <p>Chúng tôi sẽ sớm giao hàng cho bạn. Cảm ơn bạn đã tin tưởng và ủng hộ!</p>
        <p>Trân trọng,</p>
        <p><strong>Đội ngũ hỗ trợ</strong></p>
      `
    };
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Đơn hàng đã được xác nhận, email đã được gửi.' });

  } catch (error) {
    console.error('Lỗi khi gửi email xác nhận:', error);
    return res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại.' });
  }
});
router.post('/update-order-status', async (req, res) => {
  try {
    const { id, status ,email} = req.body;
    console.log("checkk statuss"+status)
    // Kiểm tra đơn hàng có tồn tại không
    const order = await history.findOne({_id: id})
    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    order.stage = status;
    const save = await order.save();
    console.log(save)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'vanthuan562004@gmail.com',
        pass: 'jsun tpst cgjl afko' 
      }
    });

    // Nội dung email
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Cập nhật trạng thái đơn hàng',
      html: `
        <p>Chào bạn,</p>
        <p>Trạng thái đơn hàng <strong>${id}</strong> của bạn đã được cập nhật.</p>
        <p><strong>Trạng thái mới:</strong> ${status}</p>
        <p>Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi!</p>
        <p>Trân trọng,</p>
        <p><strong>Đội ngũ hỗ trợ</strong></p>
      `
    };

    // Gửi email thông báo
    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'Cập nhật trạng thái đơn hàng thành công, email đã được gửi.', order });

  } catch (error) {
    console.error('Lỗi khi cập nhật đơn hàng:', error);
    return res.status(500).json({ message: 'Có lỗi xảy ra, vui lòng thử lại.' });
  }
});

router.post('/reset-password', async (req, res) => {
  const { token, newPass } = req.body;
  
  try {
    if (tokenStore.has(token)) {
      const email = tokenStore.get(token); // Lấy email từ tokenStore
      const user = await user.findOne({ 'details.email': email });
      if (!user) {
        return res.status(404).json({ message: 'Người dùng không tồn tại.' });
      }
      user.details.password = newPass;
      await user.save();
      tokenStore.delete(token);
      return res.status(200).json({ message: 'Đổi mật khẩu thành công.' });
    } else {
      return res.status(400).json({ message: 'Token không hợp lệ hoặc đã hết hạn.' });
    }
  } catch (error) {
    console.error('Lỗi khi đặt lại mật khẩu:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống. Vui lòng thử lại sau.' });
  }
});




module.exports = router;