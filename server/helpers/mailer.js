const nodemailer = require("nodemailer");
const config = require("../config/config");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.googleUser,
    pass: config.googlePassword,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

exports.sendEmail = function ({ toUser, code, type }) {
  var subject, message;

  switch (type) {
    case 0:
      subject = "Verify Account";
      message = "Your account has been created. Please enter the following code to verify your account.";
      break;
    case 1:
      subject = "Reset Password";
      message = `You recently requested to reset your password for your account. 
                 If you did not request a password reset, please ignore this email or reply to let us know.`;
      break;
    default:
      subject = "";
      message = "";
  }

  return new Promise((res, rej) => {
    message = {
      from: {
        name: 'Chat App',
        address: config.googleUser
      },
      to: toUser,
      subject: subject,
      text: "Hello! This email is from Chat App",
      html:`
            <!DOCTYPE html>
            <html>
            <head>
            
            <meta name="viewport" content="width=device-width" />
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>Chat App</title>
              
            <style>
              * { 
                margin:0;
                padding:0;
              }
              
              * { font-family: Verdana, Geneva, Tahoma, sans-serif }
              
              img { 
                max-width: 100%; 
              }
              
              .collapse {
                margin:0;
                padding:0;
              }
              
              body {
                -webkit-font-smoothing:antialiased; 
                -webkit-text-size-adjust:none; 
                width: 100%!important; 
                height: 100%;
              }
              
              a { color: #9880FE; text-decoration: none;}
              
              .code {
                color: #FFF;
                background-color: #9880FE;
                padding:10px 16px;
                font-weight:bold;
                text-align:center;
                letter-spacing: 15px;
                font-size: 20px;
              }
              
              table.social {
                background-color: #F2F2F5;
                
              }
              
              .social .soc-btn {
                padding: 3px 7px;
                font-size:12px;
                margin-bottom:10px;
                text-decoration:none;
                color: #FFF;font-weight:bold;
                display:block;
                text-align:center;
                background-color: #6440FE;
              }
              
              table.head-wrap { width: 100%;}
              
              .header.container table td.logo { padding: 15px; }
              .header.container table td.label { padding: 15px; padding-left:0px;}
              
              table.body-wrap { width: 100%;}
              
              table.footer-wrap { width: 100%;	clear:both!important;
              }
              
              h1,h2,h3,h4,h5,h6 {
              line-height: 1.1; margin-bottom:15px; color:#000;
              }
              h1 small, h2 small, h3 small, h4 small, h5 small, h6 small { font-size: 60%; color: #6f6f6f; line-height: 0; text-transform: none; }
              
              h1 { font-weight:200; font-size: 44px;}
              h2 { font-weight:200; font-size: 37px;}
              h3 { font-weight:500; font-size: 27px;}
              h4 { font-weight:500; font-size: 23px;}
              h5 { font-weight:600; font-size: 15px;}
              h6 { font-weight:900; font-size: 14px; text-transform: uppercase; color:#444;}
              
              .collapse { margin:0!important;}
              
              p, ul { 
                margin-bottom: 10px; 
                font-weight: normal; 
                font-size:14px; 
                line-height:1.6;
              }
              p.lead { font-size:17px; }
              p.last { margin-bottom:0px;}
              
              ul li {
                margin-left:5px;
                list-style-position: inside;
              }
              
              .container {
                display:block!important;
                max-width:600px!important;
                margin:0 auto!important;
                clear:both!important;
              }
              
              .content {
                padding:15px;
                max-width:600px;
                margin:0 auto;
                display:block; 
              }
              
              .content table { width: 100%; }
              
              .column {
                width: 300px;
                float:left;
              }
              .column tr td { padding: 15px; }
              .column-wrap { 
                padding:0!important; 
                margin:0 auto; 
                max-width:600px!important;
              }
              .column table { width:100%;}
              .social .column {
                width: 280px;
                min-width: 279px;
                float:left;
              }
              
              .info {
                font-size: 11px;
              }
              
              .clear { display: block; clear: both; }
              
              @media only screen and (max-width: 600px) {
                
                a[class="btn"] { display:block!important; margin-bottom:10px!important; background-image:none!important; margin-right:0!important;}
              
                div[class="column"] { width: auto!important; float:none!important;}
                
                table.social div[class="column"] {
                  width:auto!important;
                }
              
              }
            </style>
            
            </head>
            
            <body bgcolor="#FFFFFF">         
              <!-- HEADER -->
              <table class="head-wrap" bgcolor="#9880FE">
                <tr>
                <td></td>
                <td class="header container">
                  
                  <div class="content">
                    <table bgcolor="#9880FE">
                    <tr>
                      <td align="right"><h6 class="collapse">Chat App</h6></td>
                    </tr>
                  </table>
                  </div>
                  
                </td>
                <td></td>
                </tr>
              </table><!-- /HEADER -->            
              
              <!-- BODY -->
              <table class="body-wrap">
                <tr>
                <td></td>
                <td class="container" bgcolor="#FFFFFF">
              
                  <div class="content">
                  <table>
                  <tr>
                    <td>
                    <br/>
                    <h3>Hello</h3>
                    <p class="lead">${message}</p>
                    <p align="right">- Chat App Team</p>
                    <br/>
                    <p class="lead">Your code is</p>
                    <p align="center" class="code">${code}</p>
                          
                    <br/>
                    <br/>							
                    <br/>							
                          
                    <!-- social & contact -->
                    <table class="column social">
                    <tr>
                      <td>				
                      
                      <h5 class="">Visit the Project</h5>
                      <p class="">
                        <a href="https://github.com/gurkanfikretgunak/template_app_backend" class="soc-btn">Chat App</a>
                      </p>
            
                      </td>
                    </tr>
                    <tr>
                      <td>				
            
                      <p class="info">
                        The views expressed are the author's own and not Chat App's official policy. 
                        This email and its attachments are for information only and not professional advice. 
                        The recipient is responsible for verifying the information.
                      </p>
            
                      </td>
                    </tr>
                    </table>
                    
                    <span class="clear"></span>	
            
                    </td>
                  </tr>
                  </table>
                  </div>
                        
                </td>
                <td></td>
                </tr>
              </table><!-- /BODY -->
              
              <!-- FOOTER -->
              <table class="footer-wrap">
                <tr>
                <td></td>
                <td class="container">
            
                  <!-- content -->
                  <div class="content">
                  <table>
                    <tr>
                    <td align="center">
                      <p>
                      <a href="#">Terms</a> |
                      <a href="#">Privacy</a>
                      </p>
                    </td>
                    </tr>
                  </table>
                  </div><!-- /content -->
                  
                </td>
                <td></td>
                </tr>
              </table><!-- /FOOTER -->
              
            </body>
            </html>
          `,
    };

    transporter.sendMail(message, function (err, info) {
      if (err) rej(err);
      else res(info);
    });
  });
};
