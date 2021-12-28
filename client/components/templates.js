import store, { fetchApi, loadedAction, sortData } from '../redux/store';
import { useDispatch, useSelector } from "react-redux";
import 'material-icons/iconfont/material-icons.css';

const rowTemplate = (item, label) => {
    const sentIcon = () => {
        if (item === 'sent') {
            return <div className="transaction__icon"><span className="material-icons">send</span> <span className="value capitalize">{item}</span></div>
        }
        else if (item === 'received') {
            return <div className="transaction__icon"><span className="material-icons">arrow_downward</span> <span className="value capitalize">{item}</span></div>
        }
        else if (item === 'buy') {
            return <div className="transaction__icon"><span className="material-icons">receipt</span> <span className="value capitalize">{item}</span></div>
        }
        else if (item === 'sell') {
            return <div className="transaction__icon"><span className="material-icons">subdirectory_arrow_right</span> <span className="value capitalize">{item}</span></div>
        }
        else if (item === 'confirmed') {
            return <div className="transaction__icon"><span className="material-icons">check</span> <span className="value capitalize">{item}</span></div>
        }
        else if (item === 'pending') {
            return <div className="transaction__icon"><span className="material-icons">update</span> <span className="value capitalize">{item}</span></div>
        }
        else if (item === 'finished') {
            return <div className="transaction__icon"><span className="material-icons">done_all</span> <span className="value capitalize">{item}</span></div>
        }
        else {
            return <span className="value capitalize">{item}</span>
        } 
    }
    return (
        <div className="min-w-0 flex-1 flex items-center">
            <div className="data__inner">
                <span className="label">{label} </span>
                {sentIcon()}
            </div>
        </div>
    )
}
const headerTemplate = (label) => {
    const dispatch = useDispatch();
    return (
        <div className="min-w-0 flex-1 flex items-center">
            <div className="data__inner">
                <span onClick={() => dispatch(sortData(label, 'desc'))} className="label header__link">{label}</span>
            </div>
        </div>
    )
}
export {
    rowTemplate,
    headerTemplate
}