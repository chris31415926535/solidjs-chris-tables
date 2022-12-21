import { createEffect, createSignal, For } from "solid-js";

export function ChrisTable(props: any) {

    const tableKeys = Object.keys(props.data[0]);
    const numCols = tableKeys.length;
    const numRows = props.data.length;
    
    // trying pagination?
    let pageSize = 10;
    let page = 0;
    let numpages = () => {
        return Math.ceil(FilteredData().length / pageSize);
    }

    let [getFilter, setFilter] = createSignal('');

    // keep all console logging here!!
    createEffect(() => {
        console.log("numpages: "+ numpages());
      //  console.log(getFilter())
       // console.log(JSON.stringify(FilteredData()));
    })

    const FilteredData = () => {   
        if (getFilter() === '') return props.data;
        return props.data.filter((e1: any) => Object.values(e1).some((e2: any) => String(e2).search(getFilter()) > -1))
    };

    return(<div>
        <span>
        <label for="table-filter">Filter results: </label>
        <input id="table-filter" name="table-filter" type="text" placeholder="Search..."  onInput ={(e) => setFilter(e.currentTarget.value)}/>
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
            <For each={FilteredData()}>{(rowdata: any, i) => 
                <tr>
                <For each={tableKeys}>{(tableKey, i) => 
                    <td>{rowdata[tableKey]}</td>
                }</For>
                </tr>
            }</For>


            </tbody>
        </table>
        
        </div>)
}
