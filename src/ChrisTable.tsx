import { Table } from "solid-bootstrap";
import { createEffect, createSignal, For } from "solid-js";


// escape input text for regular expressions
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
function escapeRegExp(string: any) {
    return String(string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
  }


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
        if (props.verbose){
            console.log("verbosity: " + props.verbose)
        console.log("numpages: "+ NumPages());
        console.log("current page: " + getCurrentPage())
        }
      //  console.log(getFilter())
      //console.log(escapeRegExp(getFilter()))
       // console.log(JSON.stringify(FilteredData()));
    })

    // derived signal: take our input data and filter it to only those rows where any field contains the search term
    const FilteredData = () => {   
        if (getFilter() === '') return props.data;
        return props.data.filter((e1: any) => Object.values(e1).some((e2: any) => String(e2).toLowerCase().includes(getFilter().toString().toLowerCase())))
    };

    // now paginate our filtered data
    const PaginatedData = () => {
        let tempVar = FilteredData();
        let tempPaginated = tempVar.slice(getCurrentPage() * pageSize, getCurrentPage() * pageSize + pageSize);
        return tempPaginated;
    };

    // set page to 0 if input data changes
    // this works but is apparently bad practice: you're not supposed to set signals inside effects!!
    createEffect( () => {
        let x = props.data;
        setCurrentPage(0);
    })

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
        <div>Page {getCurrentPage() + 1} of {NumPages()}, {FilteredData().length} results</div>
        
        </div>)
}



export function ChrisTableBootstrap(props: any) {

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
        if (props.verbose){
            console.log("verbosity: " + props.verbose)
            console.log("numpages: "+ NumPages());
            console.log("current page: " + getCurrentPage())
        }
    })

    // derived signal: take our input data and filter it to only those rows where any field contains the search term
    const FilteredData = () => {   
        // note: String.indexOf() and String.includes() seem to work with backslashes
        // String.search() chokes with escape characters and wants to be a regex
        if (getFilter() === '') return props.data;
        return props.data.filter((e1: any) => Object.values(e1).some((e2: any) => String(e2).toLowerCase().includes(getFilter().toLowerCase())))
    };

    // now paginate our filtered data
    const PaginatedData = () => {
        let tempVar = FilteredData();
        let tempPaginated = tempVar.slice(getCurrentPage() * pageSize, getCurrentPage() * pageSize + pageSize);
        return tempPaginated;
    };

    // set page to 0 if input data changes
    // this works but is apparently bad practice: you're not supposed to set signals inside effects!!
    createEffect( () => {
        let x = props.data;
        setCurrentPage(0);        
    })

    return(<div>
        <span>
        <label for="table-filter">Filter results: </label>
        <input id="table-filter" name="table-filter" type="text" placeholder="Search..."  onInput ={(e) => {setCurrentPage(0); setFilter(e.currentTarget.value);}}/>
        </span>

        <Table striped bordered hover>
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
        </Table>
        <button name="page-down" id="page-down" onClick = {() => getCurrentPage() > 0 ? setCurrentPage(getCurrentPage() - 1) : null}>Prev Page</button>
        <button name="page-up" id="page-up" onClick = {() => getCurrentPage() < NumPages() - 1 ? setCurrentPage(getCurrentPage() + 1) : null}>Next Page</button>
        <div>Page {getCurrentPage() + 1} of {NumPages()}, {FilteredData().length} results</div>
        
        </div>)
}
