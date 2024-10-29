import loginPageSVG from "../../assets/loginPage.svg";
import crossSvg from "../../assets/cross.svg";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import "./loginPage.scss";
import { loginPagetextFields } from "../../utils/constants";

const LoginPage = () => {
  return (
    <div className="login-container">
      <img src={loginPageSVG} alt="loginPageSvg" className="image" />
      <div className="background">
        <div id="loginForm">
          <div>
            <img src={crossSvg} alt="crossSvg" className="cross-icon" />
          </div>
          <div className="d-flex flex-column justify-content-center mt-4">
            <span className="title">Login to your Account</span>
            <span className="subtitle">
              See what is going on with the Tic Tac Toe game
            </span>
            <div className="fields d-flex flex-column mt-4">
              {loginPagetextFields.map((data, index) => (
                <TextField
                  id="outlined-basic"
                  key={`${data.label}` + `${index}`}
                  label={data.label}
                  placeholder={data.placeholder}
                  type={data.type}
                  variant="outlined"
                  className={index !== 0 ? "mt-" : ""}
                />
              ))}
              <span className="forgot-password mt-3">Forget Password?</span>
              <Button variant="contained" className="login-button">
                Login
              </Button>
              <span className="register">
                Not Registered Yet?
                <span className="sign-up">Sign Up</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
