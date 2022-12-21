import { createEffect, createSignal, For } from "solid-js";

export function ChrisTable(props: any) {

    const tableKeys = Object.keys(props.data[0]);
    const numCols = tableKeys.length;
    const numRows = props.data.length;
    
    // trying pagination?
    let pageSize = 10;
    let page = 0;
    let [getCurrentPage, setCurrentPage] = createSignal(0);

    let NumPages = () => {
        return Math.ceil(FilteredData().length / pageSize);
    }

    let [getFilter, setFilter] = createSignal('');

    // keep all console logging here!!
    createEffect(() => {
        console.log("numpages: "+ NumPages());
        console.log("current page: " + getCurrentPage())
      //  console.log(getFilter())
       // console.log(JSON.stringify(FilteredData()));
    })

    const FilteredData = () => {   
        if (getFilter() === '') return props.data;
        return props.data.filter((e1: any) => Object.values(e1).some((e2: any) => String(e2).search(getFilter()) > -1))
    };

    const PaginatedData = () => {
        let tempVar = FilteredData();
        let tempPaginated = tempVar.slice(getCurrentPage() * pageSize, getCurrentPage() * pageSize + pageSize);
        return tempPaginated;
    };

    return(<div>
        <span>
        <label for="table-filter">Filter results: </label>
        <input id="table-filter" name="table-filter" type="text" placeholder="Search..."  onInput ={(e) => {setCurrentPage(0); setFilter(e.currentTarget.value);}}/>
        </span>

        <table>
            <thead>
            <tr>
                <For each={tableKeys}>{(tableKey, i) => 
                    <th>{tableKey}</th>
                }</For>
            </tr>
            </thead>
            <tbody>
            <For each={PaginatedData()}>{(rowdata: any, i) => 
                <tr>
                <For each={tableKeys}>{(tableKey, i) => 
                    <td>{rowdata[tableKey]}</td>
                }</For>
                </tr>
            }</For>


            </tbody>
        </table>
        <button name="page-down" id="page-down" onClick = {() => getCurrentPage() > 0 ? setCurrentPage(getCurrentPage() - 1) : null}>Prev Page</button>
        <button name="page-up" id="page-up" onClick = {() => getCurrentPage() < NumPages() - 1 ? setCurrentPage(getCurrentPage() + 1) : null}>Next Page</button>
        <div>Page {getCurrentPage() + 1} of {NumPages()}</div>
        
        </div>)
}
