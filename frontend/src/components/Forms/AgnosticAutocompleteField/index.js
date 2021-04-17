import React, { useEffect, useState } from "react";
import debounce from "utils/debounce";
import useOuterClick from "utils/useOuterClick";

import "./style.scss";

const AgnosticAutocompleteField = ({
  name,
  label,
  searchFn,
  selectResult,
  isResultSelected,
  ResultComponent,
  ...rest
}) => {
  const [search, setSearch] = useState({
    loading: false,
    results: [],
    errors: null,
    displayResults: false,
    __id: null,
  });

  const initField = () => {
    const now = new Date().valueOf();
    const id = btoa(`${name}_${now}`);
    setSearch((prev) => ({
      ...prev,
      __id: id,
    }));
  };

  useEffect(initField, []);

  const showResults = () => {
    if (!search.results || search.results.length === 0) {
      return false;
    }

    setSearch((prev) => ({
      ...prev,
      displayResults: true,
    }));
  };

  const hideResults = () => {
    setSearch((prev) => ({
      ...prev,
      displayResults: false,
    }));
  };

  const doSearch = debounce(async (term) => {
    setSearch((prev) => ({
      ...prev,
      loading: true,
      errors: null,
      displayResults: false,
    }));

    try {
      const { data } = await searchFn(term);
      setSearch((prev) => ({
        ...prev,
        results: data,
        displayResults: true,
      }));
    } catch (error) {
      setSearch((prev) => ({
        ...prev,
        results: [],
        errors: error.response.data.errors,
        displayResults: false,
      }));
    } finally {
      setSearch((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  }, 300);

  const hasResults =
    search.results && search.results.length > 0 && search.displayResults;
  const innerRef = useOuterClick(hideResults);

  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <div
        className={`autocomplete ${hasResults ? "has-results" : ""}`}
        ref={innerRef}
      >
        <input
          type="text"
          className="form-control"
          id={name}
          name={name}
          onInput={(event) => doSearch(event.target.value)}
          onFocus={showResults}
          readOnly={search.loading}
          {...rest}
        />
        {search.displayResults && (
          <div
            className="card autocomplete-results"
            id={`results_${search.__id}`}
          >
            {search.results.length === 0 && (
              <div className="autocomplete-result no-results">
                No se han encontrado resultados
              </div>
            )}
            {search.results.map((result, index) => {
              const isSelected = isResultSelected(result);

              return (
                <div
                  className={`autocomplete-result ${
                    isSelected ? "disabled" : ""
                  }`}
                  key={result.id}
                  onClick={() => selectResult(result)}
                >
                  <ResultComponent result={result} isSelected={isSelected} />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <span className="small text-danger mt-2">{search.errors?.term}</span>
    </div>
  );
};

export default AgnosticAutocompleteField;
