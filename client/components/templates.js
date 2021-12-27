import store, { fetchApi, loadedAction, sortData } from '../redux/store';
import { useDispatch, useSelector } from "react-redux";
const rowTemplate = (item, label) => {
    if (typeof item === 'string' || typeof item === 'number') {
        return (
            <div className="min-w-0 flex-1 flex items-center">
                <div className="data__inner">
                    <span className="label">{label}</span>
                    <span className="value capitalize">{item}</span>
                </div>
            </div>
        )
    }
    else {
        return (
            <div className="min-w-0 flex-1 flex items-center">
                <div className="data__inner">
                    <span className="label">{label}</span>
                    <span className="value"> - </span>
                </div>
            </div>
        )
    }
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