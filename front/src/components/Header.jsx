import { ASSETS_PROFILE } from "../Assets";
export default function Header({ info, onSignOut }) {

    return (
        <div className="main-page-header">
            <div className="header-left">
                <img src={ASSETS_PROFILE} className="header-img" />
                <label htmlFor="">Abhishek</label>
            </div>
            <div className="header-right">
                <button onClick={onSignOut}>SignOut</button>
            </div>
        </div>
    )
}