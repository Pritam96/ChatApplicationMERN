import { Fieldset, Input, VStack } from "@chakra-ui/react";
import { Field } from "../UI/field";
import { PasswordInput } from "../UI/password-input";
import { Button } from "../UI/button";

import { useState } from "react";
import { toaster } from "../UI/toaster";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitFormHandler = async (
    loginEmail = email,
    loginPassword = password
  ) => {
    setLoading(true);

    if (!loginEmail || !loginPassword) {
      toaster.create({
        title: "Warning",
        description: "All fields are required.",
        type: "warning",
        placement: "bottom-end",
        duration: 5000,
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "/api/v1/auth/login",
        {
          email: loginEmail,
          password: loginPassword,
        },
        config
      );

      toaster.create({
        title: "Success",
        description: "Login successful!",
        type: "success",
        placement: "bottom-end",
        duration: 5000,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (error) {
      // console.log("Login failed:", error);

      toaster.create({
        title: "Error",
        description: error.response?.data?.error || "Login Failed",
        type: "error",
        placement: "bottom-end",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const guestLoginHandler = () => {
    submitFormHandler("john@example.com", "123456");
  };

  return (
    <VStack spacing="5px">
      <Fieldset.Root size="lg" maxW="md">
        <Fieldset.Content>
          <Field
            label="Email Address"
            color="black"
            required
            // invalid
            // errorText="Invalid Email Address"
          >
            <Input
              name="email"
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field label="Password" color="black" required>
            <PasswordInput
              value={password}
              placeholder="Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>
        </Fieldset.Content>
        <Button
          type="submit"
          w="100%"
          colorPalette="cyan"
          onClick={() => submitFormHandler()}
          loading={loading}
          loadingText="Logging in..."
        >
          Login
        </Button>

        <Button
          type="submit"
          w="100%"
          colorPalette="green"
          onClick={guestLoginHandler}
        >
          Login As Guest
        </Button>
      </Fieldset.Root>
    </VStack>
  );
};

export default Login;
