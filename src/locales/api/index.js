import { defineMessages } from "react-intl";
//Messages
import UserMessages from "./UserMessages";
import PagesMessages from "./PagesMessages";
import AlertMessages from "./AlertMessages";
import ErrorMessages from "./ErrorMessages";
import GraphicMessages from "./GraphicMessages";
import ModalMessages from "./ModalMessages";

const globals = defineMessages({
  ...UserMessages,
  ...PagesMessages,
  ...AlertMessages,
  ...ErrorMessages,
  ...GraphicMessages,
  ...ModalMessages
});

export { globals };
