import { useLocale } from "../i18n";
import { Menu } from "./menu";
/**
 * Contains all the parts of a submenu.
 */
export function MenuSub(props) {
    const { direction } = useLocale();
    return <Menu placement={direction() === "rtl" ? "left-start" : "right-start"} flip {...props}/>;
}
