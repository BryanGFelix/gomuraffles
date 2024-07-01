import { ReactNode } from "react";
import Nav from "./Nav/nav";
import styles from './layout.module.css';
 
const Layout = ({ children }: {children: ReactNode}) => {
  return (
    <>
      <Nav />
      <main className={styles.content}>{children}</main>
    </>
  )
}

export default Layout;