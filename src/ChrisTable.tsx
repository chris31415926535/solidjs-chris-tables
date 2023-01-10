import { Table } from "solid-bootstrap";
import { createEffect, createMemo, createSignal, For, Index } from "solid-js";


// escape input text for regular expressions
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#escaping
function escapeRegExp(string: any) {
    return String(string).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

interface TableOptions {
    columns?: string[]
    columnNames?: string[]
    pageSize?: number
}

interface TableData{
   [key: string]: any;
}
    
export function ChrisTable(props: {data: TableData, options?: TableOptions, verbose: boolean}) {
    
    // handle optional options
    let pageSize = 10;
    let tableKeys: string[];
    try {
        tableKeys = Object.keys(props.data[0])
    } catch {
        tableKeys = ["No Data"]
    };
    
    let columnNames = tableKeys;
    if (props.options === undefined) {
        // PLACEHOLDER for additional stuff if options are NOT provided
    } else {
        if (props.options.pageSize)  pageSize = props.options.pageSize;
        if (props.options.columns) {
            // if columns are provided, as an interim step set the columnNames to only include those columns
            tableKeys = props.options.columns;
            columnNames = tableKeys;
        }
        if (props.options.columnNames) columnNames = props.options.columnNames;
    }

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
        <For each={columnNames}>{(columnName, i) => 
            <th>{columnName}</th>
        }</For>
        </tr>
        </thead>
        <tbody>
        <For each={PaginatedData()}>{(rowdata: any, i) => (
            // if (rowdata){
            <tr>
            <For each={tableKeys}>{(tableKey, i) => 
                <td>{rowdata? rowdata[tableKey] : "No Data"}</td>
            }</For>
            </tr>
            // } else {
            //     <tr><td>no data</td></tr>
            // }}
            )
        }</For>
        
        
        </tbody>
        </table>
        <button name="page-down" id="page-down" onClick = {() => getCurrentPage() > 0 ? setCurrentPage(getCurrentPage() - 1) : null}>Prev Page</button>
        <button name="page-up" id="page-up" onClick = {() => getCurrentPage() < NumPages() - 1 ? setCurrentPage(getCurrentPage() + 1) : null}>Next Page</button>
        <div>Page {getCurrentPage() + 1} of {NumPages()}, {FilteredData().length} results</div>
        
        </div>)
    }
    
    




    export function ChrisTableBootstrap(props: {data: TableData, options?: TableOptions, verbose?: boolean}) {
        
            // handle optional options
    let pageSize = 10;

    let tableKeys: string[];
    try {
    tableKeys = Object.keys(props.data[0])
    } catch {
    tableKeys = ["No Data"]
    };

    let columnNames = tableKeys;
    if (props.options === undefined) {
        // PLACEHOLDER for additional stuff if options are NOT provided
    } else {
        if (props.options.pageSize)  pageSize = props.options.pageSize;
        if (props.options.columns) {
            // if columns are provided, as an interim step set the columnNames to only include those columns
            tableKeys = props.options.columns;
            columnNames = tableKeys;
        }
        if (props.options.columnNames) columnNames = props.options.columnNames;
    }
        
        
        // for convenience, console logging here when possible!!
        createEffect(() => {
            if (props.verbose){

            }
        })
        
        
        /// trying sorting, i think i need a new signal and maybe a derived signal
        let [getSortData, setSortData] = createSignal({sortColumn: '', sortDirection: false, trigger: 0})
        
        // sorted data is stored in a derived signal, fed by the input data (props.data) and the getSortData() signal
        const SortedDataDerived = () => {
             
            // start with the provided data
            let tempvar = props.data.slice();
            
            // if no column, just return input data
            if (getSortData().sortColumn === '') return props.data;
            
            // sorting in one direction..
            if (getSortData().sortDirection){
                tempvar.sort((a: any, b: any) => {
                    let x=a[getSortData().sortColumn].toUpperCase();
                    let y=b[getSortData().sortColumn].toUpperCase();
                    let result = x > y ? 1: -1;
                    return (result)
                })
            }
            
            // sorting in the other direction...
            if (!getSortData().sortDirection){
                tempvar.sort((a: any , b: any) => {
                    let x=a[getSortData().sortColumn].toUpperCase();
                    let y=b[getSortData().sortColumn].toUpperCase();
                    let result = x < y ? 1: -1;
                    return (result)
                })
            }
            return tempvar;
        }
        
        
        
        
        // next we take our (optionally) sorted data and filter it
        
        let [getFilter, setFilter] = createSignal('');
        
        // derived signal: take our input data and filter it to only those rows where any field contains the search term
        const FilteredData = () => {   
            // note: String.indexOf() and String.includes() seem to work with backslashes
            // String.search() chokes with escape characters and wants to be a regex
            if (getFilter() === '') return SortedDataDerived();
            return SortedDataDerived().filter((e1: any) => Object.values(e1).some((e2: any) => String(e2).toLowerCase().includes(getFilter().toLowerCase())))
        };
        
        // next we paginate our sorted and filtered data
        let [getCurrentPage, setCurrentPage] = createSignal(0);
        
        let NumPages = () => {
            return Math.ceil(FilteredData().length / pageSize);
        }
        
        // now paginate our filtered data
        const PaginatedData = () => {
            let tempVar = FilteredData();
            // console.log(tempVar)
            let tempPaginated = tempVar.slice(getCurrentPage() * pageSize, getCurrentPage() * pageSize + pageSize);
            return tempPaginated;
        };
        
        // set page to 0 if input data changes
        // this works but is apparently bad practice: you're not supposed to set signals inside effects!!
        // it definitely crashes if you try to SET a signal using a GET of that same signal inside this effect.
        createEffect( () => {
            let x = props.data;
            setCurrentPage(0);
            setSortData({sortColumn: '', sortDirection: false, trigger: Date.now()})
        })
        
        // testing: can we set page to 0 if we do a new sort? doesn't work like this!
        createEffect( () => {
            getSortData();
            setCurrentPage(0);
            //▲
        })
        
        
        return(<div>
            <span>
            <label for="table-filter">Filter results: </label>
            <input id="table-filter" name="table-filter" type="text" placeholder="Search..."  onInput ={(e) => {setCurrentPage(0); setFilter(e.currentTarget.value);}}/>
            </span>
            
            <Table striped bordered hover>
            <thead>
            <tr>
            <For each={columnNames}>{(columnName, i) => 
                <th onClick={() => {setSortData({sortColumn: tableKeys[i()], trigger: Date.now(), sortDirection: !getSortData().sortDirection }); }}>
                    {(getSortData().sortColumn === tableKeys[i()] ?
                    (getSortData().sortDirection ? "▲" : "▼")
                    : "") + columnName }
                    </th>
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
            <button name="page-first" id="page-first" onClick = {() => setCurrentPage(0)}>{"\u2bc7"}{"\u2bc7"} First Page</button>
            <button name="page-down" id="page-down" onClick = {() => getCurrentPage() > 0 ? setCurrentPage(getCurrentPage() - 1) : null}>{"\u2bc7"} Prev</button>
            <button name="page-up" id="page-up" onClick = {() => getCurrentPage() < NumPages() - 1 ? setCurrentPage(getCurrentPage() + 1) : null}>Next {"\u2bc8"}</button>
            <button name="page-last" id="page-last" onClick = {() => setCurrentPage(NumPages()-1)}>Last Page {"\u2bc8"}{"\u2bc8"}</button>
            <div>Page {getCurrentPage() + 1} of {NumPages()}, {FilteredData().length} results</div>
            </div>)
        }




        export function ChrisTableBootstrapIndex(props: {data: TableData, options?: TableOptions, verbose?: boolean}) {

            // handle optional options
            let pageSize = 10;
        
            let tableKeys: string[];
            try {
            tableKeys = Object.keys(props.data[0])
            } catch {
            tableKeys = ["No Data"]
            };
        
            let columnNames = tableKeys;
        
            if (props.options === undefined) {
            // PLACEHOLDER for additional stuff if options are NOT provided
            } else {
            if (props.options.pageSize)  pageSize = props.options.pageSize;
            if (props.options.columns) {
                // if columns are provided, as an interim step set the columnNames to only include those columns
                tableKeys = props.options.columns;
                columnNames = tableKeys;
            }
            if (props.options.columnNames) columnNames = props.options.columnNames;
            }
        
        
            // for convenience, console logging here when possible!!
            createEffect(() => {
            if (props.verbose){
                console.log("column names" + columnNames)
            }
            })
        
        
            /// trying sorting, i think i need a new signal and maybe a derived signal
            let [getSortData, setSortData] = createSignal({sortColumn: '', sortDirection: false, trigger: 0})
        
            // sorted data is stored in a derived signal, fed by the input data (props.data) and the getSortData() signal
            const SortedDataDerived = () => {
        
            // start with the provided data
            let tempvar = props.data.slice();
        
            // if no column, just return input data
            if (getSortData().sortColumn === '') return props.data;
        
            // sorting in one direction..
            if (getSortData().sortDirection){
                tempvar.sort((a: any, b: any) => {
                    let x=a[getSortData().sortColumn].toUpperCase();
                    let y=b[getSortData().sortColumn].toUpperCase();
                    let result = x > y ? 1: -1;
                    return (result)
                })
            }
        
            // sorting in the other direction...
            if (!getSortData().sortDirection){
                tempvar.sort((a: any , b: any) => {
                    let x=a[getSortData().sortColumn].toUpperCase();
                    let y=b[getSortData().sortColumn].toUpperCase();
                    let result = x < y ? 1: -1;
                    return (result)
                })
            }
            return tempvar;
            }
        
        
        
        
            // next we take our (optionally) sorted data and filter it
        
            let [getFilter, setFilter] = createSignal('');
        
            // derived signal: take our input data and filter it to only those rows where any field contains the search term
            const FilteredData = () => {   
            // note: String.indexOf() and String.includes() seem to work with backslashes
            // String.search() chokes with escape characters and wants to be a regex
            if (getFilter() === '') return SortedDataDerived();
            return SortedDataDerived().filter((e1: any) => Object.values(e1).some((e2: any) => String(e2).toLowerCase().includes(getFilter().toLowerCase())))
            };
        
            // next we paginate our sorted and filtered data
            let [getCurrentPage, setCurrentPage] = createSignal(0);
        
            let NumPages = () => {
            return Math.ceil(FilteredData().length / pageSize);
            }
        
            // now paginate our filtered data
            const PaginatedData = () => {
            let tempVar = FilteredData();
            // console.log(tempVar)
            let tempPaginated = tempVar.slice(getCurrentPage() * pageSize, getCurrentPage() * pageSize + pageSize);
            return tempPaginated;
            };
        
            // set page to 0 if input data changes
            // this works but is apparently bad practice: you're not supposed to set signals inside effects!!
            // it definitely crashes if you try to SET a signal using a GET of that same signal inside this effect.
            createEffect( () => {
            let x = props.data;
            setCurrentPage(0);
            setSortData({sortColumn: '', sortDirection: false, trigger: Date.now()})
            })
        
            // testing: can we set page to 0 if we do a new sort? doesn't work like this!
            createEffect( () => {
            getSortData();
            setCurrentPage(0);
            //▲
            })
        
        
            return(<div>
            <span>
            <label for="table-filter">Filter results: </label>
            <input id="table-filter" name="table-filter" type="text" placeholder="Search..."  onInput ={(e) => {setCurrentPage(0); setFilter(e.currentTarget.value);}}/>
            </span>
        
            <Table striped bordered hover>
            <thead>
                <tr>
                    <Index each={columnNames}>{(columnName, i) => 
                        <th onClick={() => {setSortData({sortColumn: tableKeys[i], trigger: Date.now(), sortDirection: !getSortData().sortDirection }); }}>
                            {((getSortData().sortColumn === tableKeys[i]) ? (getSortData().sortDirection ? "▲" : "▼") : "") + columnName()}
                            </th>
                        }
                    </Index>
                    </tr>
                    </thead>
                    <tbody>
                <Index each={PaginatedData()}>{(rowdata: any, i) => 
                        <tr>
                        <Index each={tableKeys}>{(tableKey, i) => 
                            <td>{rowdata() ? rowdata()[tableKey()] : ""}</td>
                        }</Index>
                        </tr>
                }</Index>
                    
                    </tbody>
                    </Table>
                    <button name="page-first" id="page-first" onClick = {() => setCurrentPage(0)}>{"\u2bc7"}{"\u2bc7"} First Page</button>
                    <button name="page-down" id="page-down" onClick = {() => getCurrentPage() > 0 ? setCurrentPage(getCurrentPage() - 1) : null}>{"\u2bc7"} Prev</button>
                    <button name="page-up" id="page-up" onClick = {() => getCurrentPage() < NumPages() - 1 ? setCurrentPage(getCurrentPage() + 1) : null}>Next {"\u2bc8"}</button>
                    <button name="page-last" id="page-last" onClick = {() => setCurrentPage(NumPages()-1)}>Last Page {"\u2bc8"}{"\u2bc8"}</button>
                    <div>Page {getCurrentPage() + 1} of {NumPages()}, {FilteredData().length} results</div>
                    </div>)
                }
        
                                    
                                    
                                    
                                    


