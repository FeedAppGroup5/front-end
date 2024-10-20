import './footer.css'

export default function Footer(props) {

    return <footer>
        <div className="copyright">
            {props.footerText}
        </div>
    </footer>

}