const express = require("express");
var methodOverride = require("method-override");
const app = express();
const path = require("path");
require("dotenv").config();
const dataBase = require("./config/connectDb");
const router = require("./router/client/index");
const routerAdmin = require("./router/admin/index");
const system = require("./config/system.js");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("express-flash");

// Kết nối cơ sở dữ liệu
dataBase.connect();

// Đọc dữ liệu gửi lên từ form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Cấu hình view engine là Pug
app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");

// Dùng phương thức ghi đè để có thể dùng các phương thức khác ngoài POST và GET
app.use(methodOverride("_method"));

// Sử dụng thư mục public để chứa các file tĩnh (CSS, JS, ảnh)
app.use(express.static(`${__dirname}/public`));
// Tinymce
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
// Cấu hình `cookie-parser`
app.use(cookieParser());


app.use(
  session({
    secret: "DSSHSHDHDH",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

// Sử dụng flash cho thông báo tạm thời
app.use(flash());

// Biến toàn cục dùng cho template
app.locals.prefixAdmin = system.prefixAdmin;

// Route mặc định
app.get("/", (req, res) => {
  res.render("client/page/home/index");
});

// Định tuyến (router)
router(app);
routerAdmin(app);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`✅ Server đang chạy tại http://localhost:${port}`);
});
