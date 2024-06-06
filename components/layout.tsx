import Nav from "./Nav/nav";
import styles from './layout.module.css';
 
const Layout = ({ children }) => {
  return (
    <>
      <Nav />
      <main className={styles.content}>{children}</main>
    </>
  )
}

export default Layout;