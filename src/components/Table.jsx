import React from 'react'
import { useTable, usePagination } from 'react-table'

function Table({
    columns,
    data,
    loading,
    pageCount: controlledPageCount,
    fetchData
  }) {
    const {
      getTableProps,
      getTableBodyProps,
      headerGroups,
      prepareRow,
      page,
      canPreviousPage,
      canNextPage,
      pageOptions,
      pageCount,
      gotoPage,
      nextPage,
      previousPage,
      setPageSize,
      // Get the state from the instance
      state: { pageIndex, pageSize },
    } = useTable(
      {
        columns,
        data,
        initialState: { pageIndex: 0,pageSize:10 }, // Pass our hoisted table state
        manualPagination: true, // Tell the usePagination
        // hook that we'll handle our own data fetching
        // This means we'll also have to provide our own
        // pageCount.
        pageCount: controlledPageCount,
      },
      usePagination
    )
  
    //Listen for changes in pagination and use the state to fetch our new data
    React.useEffect(() => {
      fetchData({ pageIndex, pageSize })
    }, [fetchData, pageIndex, pageSize])
  
    // Render the UI for your table
    return (
      <>
        {/* <pre>
          <code>
            {JSON.stringify(
              {
                pageIndex,
                pageSize,
                pageCount,
                canNextPage,
                canPreviousPage,
              },
              null,
              2
            )}
          </code>
        </pre> */}
        <table className='table table-striped table-sm fs-14' {...getTableProps()}>
          <thead>
            {headerGroups.map(headerGroup => (
              <tr className='alert alert-secondary' {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps()}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row)
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  })}
                </tr>
              )
            })}
            <tr>
              {loading ? (
                // Use our custom loading state to show a loading indicator
                <td colSpan="10000" className='text-center py-4'>
                  <div className="spinner-border text-success" role="status"></div> Loading...
                </td>
              ) : (
                <td colSpan="10000">
                  Showing {page.length} of ~{controlledPageCount * pageSize}{' '}
                  results
                </td>
              )}
            </tr>
          </tbody>
        </table>
        {/* 
          Pagination can be built however you'd like. 
          This is just a very basic UI implementation:
        */}
        <div className="pagination d-flex justify-content-between">
          <div className='fs-14 fw-600'>
            <span>
              Page{' '}
              <strong>
                {pageIndex + 1} of {pageOptions.length}
              </strong>{' '}
            </span>
          </div>
          <div className='pagination-btn'>
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}><i className='bi-chevron-double-left'></i></button>{' '}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}><i className='bi-chevron-left'></i></button>{' '}
            <button onClick={() => nextPage()} disabled={!canNextPage}><i className='bi-chevron-right'></i></button>{' '}
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}><i className='bi-chevron-double-right'></i></button>{' '}
          </div>
          <div className='d-flex align-items-center justify-content-between'>
            <span className='text-nowrap px-3 fs-14'>Go to page:</span>
            <span className='pe-3'>
              <input
                type="number"
                className='form-control form-control-sm'
                defaultValue={pageIndex + 1}
                onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  gotoPage(page)
                }}
                style={{ width: '80px' }}
              />
            </span>{' '}
            <select
              value={pageSize}
              className="form-select form-select-sm"
              onChange={e => {
                setPageSize(Number(e.target.value))
              }}
            >
              {[10, 20, 30, 40, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </>
    )
  }

  
export default Table