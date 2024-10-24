import styles from "./header.module.css";

export default function Header(props) {
    return <header>
        <h1  className={styles.mainHeader}>
            {props.headerText}
        </h1>
    </header>
}