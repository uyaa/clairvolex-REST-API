import React, { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

export function DataGridTable() {
  const [tableData, setTableData] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 2,
  });
  const [sortModel, setSortModel] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [inputSearch, setInputSearch] = useState("");
  const [search, setSearch] = useState("");

  const [rowCountState, setRowCountState] = useState(10);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "title",
      headerName: "Title",
      width: 350,
    },
    {
      field: "author",
      headerName: "Author",
      width: 250,
    },
    {
      field: "publish-date",
      headerName: "publish Date",
      width: 200,
    },
    {
      field: "genre",
      headerName: "Genre",
      width: 500,
    },
  ];

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("http://localhost:8000/books", {
        params: {
          page: paginationModel?.page + 1 || 1,
          sort: sortModel,
          search: search,
        },
      })
      .then((response) => {
        setIsLoading(false);
        setTableData(response.data.data);
        setRowCountState(response.data.total);
      });
  }, [paginationModel, sortModel, search]);

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <div>
        <input
          value={inputSearch}
          onChange={(e) => setInputSearch(e.target.value)}
        />
        <button
          onClick={() => {
            setSearch(inputSearch);
            setInputSearch("");
          }}
        >
          search
        </button>
      </div>
      <DataGrid
        rows={tableData}
        columns={columns}
        paginationModel={paginationModel}
        loading={isLoading}
        onPaginationModelChange={(n) => setPaginationModel(n)}
        paginationMode="server"
        rowCount={rowCountState}
        sortingMode="server"
        onSortModelChange={(e) => setSortModel(e)}
      />
    </Box>
  );
}
