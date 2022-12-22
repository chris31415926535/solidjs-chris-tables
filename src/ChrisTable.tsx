import { Table } from "solid-bootstrap";
import { createEffect, createMemo, createSignal, For } from "solid-js";


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
        
        
        /// trying sorting, i think i need a new signal and maybe a derived signal
        let [getSortData, setSortData] = createSignal({sortColumn: '', trigger: 0})
        let [getSortedData, setSortedData] = createSignal(props.data);
        
        const SortedDataMemo = createMemo(() => {
            console.log("SortedDataMemo() fired")
            
            let tempvar = sortData(props.data, getSortData().sortColumn);
            console.log(props.data)
            console.log(getSortData().sortColumn)
            console.log(tempvar);
            return tempvar
        });
        
        const value = createMemo(() => 5 + 5);
        console.log(SortedDataMemo())
        
        const SortedDataDerived = () => {
            console.log("SortedDataDerived() fired")
            let x = getSortData().trigger;
            console.log(x)
            let tempvar = sortData(props.data, getSortData().sortColumn);
            //let test = sortData(props.data, getSortData().sortColumn);
            //console.log(test);
            return tempvar;
        }
        
        
        function sortData(inputData, tableKey: string) {
            //  setSortData({...getSortData(), trigger: Date.now()})
            
            let sorting: boolean = true;
            let sortedData = inputData.slice();
            
            while (sorting){
                sorting = false;
                //console.log("doing a sort" + sortedData.length)
                
                for (let i = 0; i < (sortedData.length - 1); i++){
                    //console.log(i)
                    //console.log(inputData[i][tableKey])
                    // destructuring assignment: https://stackoverflow.com/questions/872310/javascript-swap-array-elements
                    if (sortedData[i][tableKey] > sortedData[i+1][tableKey]) {
                        // console.log (sortedData[i][tableKey] + "is bigger than" + sortedData[i+1][tableKey] +", swapping");
                        [sortedData[i][tableKey],  sortedData[i+1][tableKey]] = [sortedData[i+1][tableKey],  sortedData[i][tableKey]];
                        sorting = true;
                    }
                }
            }
            // console.log(sortedData);
            //  console.log(tableKey);
            //setSortedData(sortedData);
            return sortedData;
        }
        
        function sortData2(tableKey: string) {
            //  setSortData({...getSortData(), trigger: Date.now()})
            
            let sorting: boolean = true;
            let sortedData = props.data.slice();
            
            while (sorting){
                sorting = false;
                //console.log("doing a sort" + sortedData.length)
                
                for (let i = 0; i < (sortedData.length - 1); i++){
                    //console.log(i)
                    //console.log(inputData[i][tableKey])
                    // destructuring assignment: https://stackoverflow.com/questions/872310/javascript-swap-array-elements
                    if (sortedData[i][tableKey] > sortedData[i+1][tableKey]) {
                        // console.log (sortedData[i][tableKey] + "is bigger than" + sortedData[i+1][tableKey] +", swapping");
                        [sortedData[i][tableKey],  sortedData[i+1][tableKey]] = [sortedData[i+1][tableKey],  sortedData[i][tableKey]];
                        sorting = true;
                    }
                }
            }
            // console.log(sortedData);
            //  console.log(tableKey);
            setSortedData(sortedData);
            //return sortedData;
        }
        
        // const SortedData = () => {
        
        //     return props.data;
        // }
        
        
        let [getFilter, setFilter] = createSignal('');
        
        // keep all console logging here!!
        createEffect(() => {
            if (props.verbose){
                // console.log("verbosity: " + props.verbose)
                // console.log("numpages: "+ NumPages());
                // console.log("current page: " + getCurrentPage())
                
                // console.log("FilteredData(): " + JSON.stringify(FilteredData()))
                // console.log("PaginatedData(): " + JSON.stringify(PaginatedData()))
                // console.log(SortedDataDerived())
                // console.log("SortedDataMemo() " + JSON.stringify(SortedDataMemo()))
                console.log("getSortedData()")
                console.log(getSortedData())
            }
        })
        
        // derived signal: take our input data and filter it to only those rows where any field contains the search term
        const FilteredData = () => {   
            // note: String.indexOf() and String.includes() seem to work with backslashes
            // String.search() chokes with escape characters and wants to be a regex
            if (getFilter() === '') return getSortedData();
            return getSortedData().filter((e1: any) => Object.values(e1).some((e2: any) => String(e2).toLowerCase().includes(getFilter().toLowerCase())))
        };
        
        // trying pagination?
        let pageSize = 10;
        let page = 0;
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
                // <th onClick={() => setSortedData(sortData(props.data, tableKey))}>{tableKey}</th>
                // <th onClick={() => doSort({sortColumn: tableKey})}>{tableKey}</th>
                // <th onClick={() => {console.log("click"); setSortData({sortColumn: tableKey, trigger: Date.now() }); console.log(getSortData())}}>{tableKey}</th>
                <th onClick={() => {console.log("click"); sortData2(tableKey)}}>{tableKey}</th>
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
            <div><h3>sorted data</h3>{JSON.stringify(SortedDataDerived())}</div>
            <div><h3>filtered data</h3>{JSON.stringify(FilteredData())}</div>
            <div><h3>paginated data</h3>{JSON.stringify(PaginatedData())}</div>
            </div>)
        }
        
        
        
        export function ChrisTableBootstrap2(props: any) {
            
            const tableKeys = Object.keys(props.data[0]);
            
            
            // for convenience, console logging here when possible!!
            createEffect(() => {
                if (props.verbose){
                    
                }
            })


            /// trying sorting, i think i need a new signal and maybe a derived signal
            let [getSortData, setSortData] = createSignal({sortColumn: '', sortDirection: false, trigger: 0})
             
            // sorted data is stored in a derived signal, fed by the input data (props.data) and the getSortData() signal
            const SortedDataDerived = () => {
                //console.log("SortedDataDerived() fired")
                
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
            let pageSize = 10;
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
                <For each={tableKeys}>{(tableKey, i) => 
                    <th onClick={() => {setSortData({sortColumn: tableKey, trigger: Date.now(), sortDirection: !getSortData().sortDirection }); }}>{tableKey}</th>
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
