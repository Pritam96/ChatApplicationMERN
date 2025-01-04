import { Fieldset, Input, VStack } from "@chakra-ui/react";
import { Field } from "../UI/field";
import { useState } from "react";
import { PasswordInput } from "../UI/password-input";
import { Button } from "../UI/button";
import { toaster } from "../UI/toaster";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ChatState } from "../../Context/ChatProvider";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = ChatState();

  const navigate = useNavigate();

  const submitFormHandler = async () => {
    setLoading(true);

    // Validation
    if (!name || !email || !phone || !password || !confirmPassword) {
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

    if (password !== confirmPassword) {
      toaster.create({
        title: "Warning",
        description: "Passwords do not match.",
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
        "/api/v1/auth/register",
        {
          name,
          email,
          phone,
          password,
        },
        config
      );

      toaster.create({
        title: "Success",
        description: "Registration successful!",
        type: "success",
        placement: "bottom-end",
        duration: 5000,
      });

      setUser(data);
      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/chats");
    } catch (error) {
      // console.error("Login failed:", error, error.response?.data?.error);

      toaster.create({
        title: "Error",
        description: error.response?.data?.error || "Registration Failed",
        type: "error",
        placement: "bottom-end",
        duration: 5000,
      });
    } finally {
      // Clear fields after success
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px">
      <Fieldset.Root size="lg" maxW="md">
        <Fieldset.Content>
          <Field label="Name" color="black" required>
            <Input
              name="name"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>

          <Field label="Email Address" color="black" required>
            <Input
              name="email"
              type="email"
              placeholder="Enter Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>

          <Field label="Phone Number" color="black" required>
            <Input
              name="phone"
              type="text"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Field>

          <Field label="Password" color="black" required>
            <PasswordInput
              value={password}
              placeholder="Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Field>

          <Field label="Confirm Password" color="black" required>
            <PasswordInput
              value={confirmPassword}
              placeholder="Confirm Your Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Field>
        </Fieldset.Content>
        <Button
          type="submit"
          w="100%"
          colorPalette="cyan"
          onClick={() => submitFormHandler()}
          loading={loading}
          loadingText="Registering..."
        >
          Register
        </Button>
      </Fieldset.Root>
    </VStack>
  );
};

export default Register;
