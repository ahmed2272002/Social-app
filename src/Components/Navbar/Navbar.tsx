import { useContext } from "react";
import logo from "../../assets/logo.png";
import { Button, Dropdown, Label, Tabs } from "@heroui/react";
import { House, Menu, MessageCircle, Settings, User } from "lucide-react";
import { TokenContext } from "../Context/tokenContext";
import { Link } from "react-router";
import { UserContext, type UserContextType } from "../Context/UserContext";

function Navbar() {
  const { setToken } = useContext(TokenContext);

  // function to handle logout
  function Logout() {
    localStorage.removeItem("userToken");
    // two method to do logout (easy one navigate , prefer useContext)
    // 1-
    //navigate to login
    // navigate('/auth/login')

    // 2-
    setToken(null);
  }

  const {UserDetails} :UserContextType = useContext(UserContext)

  return (
    <>
      <nav className="bg-gray-300 py-5">
        <div className="container mx-auto flex justify-between items-center">
          <div className="nav-logo flex items-center gap-3">
            <img
              src={logo}
              className="w-[40px] rounded-xl object-cover"
              alt="logo"
            />
            <h1 className=" text-xl font-bold">Route Posts</h1>
          </div>

          <div className="nav-links">
            <Tabs className="w-full max-w-md">
              <Tabs.ListContainer>
                <Tabs.List aria-label="Options">
                  <Tabs.Tab id="feed" className="flex gap-3">
                    <House />
                    <Link to={"/feed"}>Feed</Link>
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="Profile" className="flex gap-3">
                    <User />
                    <Link to={"/profile"}>Profile</Link>
                    <Tabs.Indicator />
                  </Tabs.Tab>
                  <Tabs.Tab id="Notification" className="flex gap-3">
                    <MessageCircle />
                    <Link to={"/notification"}>Notification</Link>
                    <Tabs.Indicator />
                  </Tabs.Tab>
                </Tabs.List>
              </Tabs.ListContainer>
            </Tabs>
          </div>

          <div className="nav-action">
            <Dropdown>
              <Button
                aria-label="Menu"
                variant="secondary"
                className="py-6 px-4"
              >
                <img
                  src={UserDetails?.photo}
                  className="w-8 object-cover"
                  alt="userAvatar"
                />
                <p className="text-black">{UserDetails?.name}</p>
                <Menu className="text-gray-500" />
              </Button>
              <Dropdown.Popover className="rounded-md">
                <Dropdown.Menu
                  onAction={(key) => console.log(`Selected: ${key}`)}
                >
                  <Dropdown.Item id="Profile" textValue="Profile">
                    <Link to={"/profile"} className="flex items-center gap-3 w-full">
                    <User />
                    <Label>Profile</Label>
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item id="setting" textValue="Setting">
                    <Link to={"/Setting"} className="flex items-center gap-3 w-full">
                    <Settings />
                    <Label>Setting</Label>
                    </Link>
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => Logout()}
                    id="logout"
                    textValue="Delete file"
                    variant="danger"
                  >
                    <Label>Logout</Label>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown.Popover>
            </Dropdown>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
