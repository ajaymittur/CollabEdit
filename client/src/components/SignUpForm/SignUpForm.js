import React, { useState } from "react";
import { withRouter, useHistory } from "react-router-dom";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockTwoToneIcon from "@material-ui/icons/LockTwoTone";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Alert from "@material-ui/lab/Alert";
import AlertTitle from "@material-ui/lab/AlertTitle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { SIGNUP } from "../../routes/routes";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="#">
        CollabEdit
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: "#1E417E",
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

function SignUpForm(props) {
  const classes = useStyles();

  let history = useHistory();

  const [errors, setErrors] = useState({});
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");

  document.title = "CollabEdit | Sign Up";

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handleNameChange = (event) => setName(event.target.value);
  const handleUsernameChange = (event) => setUsername(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleRepasswordChange = (event) => setRepassword(event.target.value);

  function handleSubmit(data) {
    let error = {};
    if (password !== repassword) error.pass = "Passwords do not match";

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))
      error.em = "Enter a valid email address";

    if (!email || !password || !repassword || !name || !username)
      error.fill = "Make sure you fill in all the fields";

    if (password.length < 8)
      error.pass = "Password should be atleast 8 characters in length";

    setErrors(error);

    if (Object.keys(error).length === 0) {
      axios
        .post(SIGNUP, {
          name,
          username,
          password,
          email,
          name,
        })
        .then((res) => {
          console.log(res);
          localStorage.setItem("token", res.data.token);

          history.push({
            pathname: "/dashboard", //Enter dashboard route here
          });
        })
        .catch((error) => {
          console.log(error.response);
          setErrors({ invalid: error.response.data });
        });
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockTwoToneIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Full Name"
                onChange={handleNameChange}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                autoComplete="uname"
                name="userName"
                variant="outlined"
                required
                fullWidth
                id="userName"
                label="Username"
                onChange={handleUsernameChange}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={handleEmailChange}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="repassword"
                autoComplete="current-password"
                onChange={handleRepasswordChange}
              />
            </Grid>
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            endIcon={<ExitToAppIcon />}
            onClick={handleSubmit}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/login" variant="body2">
                Already have an account? Log in
              </Link>
            </Grid>
            {Object.entries(errors).length > 0 && (
              <Alert severity="error">
                <AlertTitle>Error</AlertTitle>
                There were some errors with your submission <br></br>
                <strong>
                  {Object.keys(errors).map(
                    (key, index) => `${index + 1}) ` + errors[key] + " "
                  )}
                  <br></br>
                </strong>
              </Alert>
            )}
          </Grid>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
    </Container>
  );
}

export default withRouter(SignUpForm);
