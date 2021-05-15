import React from "react";
import {useQuery} from "utils/router";
import {Link} from "react-router-dom";

const Pager = ({data, className}) => {
    const {page} = useQuery();

    const searchForPage = (currentSearch, delta) => {
        const params = new URLSearchParams(currentSearch);
        params.set("page", (Number(params.get("page")) || 0) + delta);
        return params.toString();
    }

    const pageNumber = page && Number(page);
    return (
        <div className={className || "float-right btn-group"}>
            {pageNumber ?
                <Link
                    className="btn btn-sm btn-outline-primary"
                    to={location => ({...location, search: searchForPage(location.search, -1)})}
                >
                    &lt; Anterior
                </Link> : null}
            <span className="btn-sm">
                Página {(pageNumber || 0) + 1}
            </span>
            {data.length >= 50 ?
                <Link
                    className="btn btn-sm btn-outline-primary"
                    to={location => ({...location, search: searchForPage(location.search, +1)})}
                >
                    Próxima &gt;
                </Link> : null}
        </div>
    )
};

export default Pager;