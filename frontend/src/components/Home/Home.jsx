import { Box, Container, Link, Tabs, Text } from "@chakra-ui/react";
import { LuUser, LuUserPlus } from "react-icons/lu";
import Login from "../Authentication/Login";
import Register from "../Authentication/Register";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (!user) {
      navigate("/");
    } else {
      navigate("/chats");
    }
  }, [navigate]);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p="3"
        bg="white"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Roboto, sans-serif" color="black">
          Chat-App
        </Text>
      </Box>
      <Box bg="white" w="100%" p="4" borderRadius="lg" borderWidth="1px">
        <Tabs.Root defaultValue="sign-in" variant="plain">
          <Tabs.List width="100%">
            <Tabs.Trigger
              value="sign-in"
              asChild
              width="50%"
              justifyContent="center"
            >
              <Link unstyled href="#sign-in">
                <LuUser size="24" />
                Login
              </Link>
            </Tabs.Trigger>
            <Tabs.Trigger
              value="sign-up"
              asChild
              width="50%"
              justifyContent="center"
            >
              <Link unstyled href="#sign-up">
                <LuUserPlus size="24" />
                Register
              </Link>
            </Tabs.Trigger>
            <Tabs.Indicator rounded="l2" />
          </Tabs.List>
          <Tabs.Content value="sign-in">
            <Login />
          </Tabs.Content>
          <Tabs.Content value="sign-up">
            <Register />
          </Tabs.Content>
        </Tabs.Root>
      </Box>
    </Container>
  );
};

export default Home;
