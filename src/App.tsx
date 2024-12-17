import { ArrowDown } from "lucide-react";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputNumber } from "primereact/inputnumber";
import { OverlayPanel } from "primereact/overlaypanel";
import { Paginator } from "primereact/paginator";
import { useEffect, useRef, useState } from "react";
import { LABELS } from "./constants/labels";
import { ArticleService } from "./services/article-service";
import { ArticleDataType, DataType } from "./types";

function App() {
  const [data, setData] = useState<ArticleDataType>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);
  const [selection, setSelection] = useState<DataType[]>([]);
  const [markCount, setMarkCount] = useState<number>(0);
  const [remainingToMark, setRemainingToMark] = useState<number>(0);

  const op = useRef(null);

  const PAGE_SIZE = data?.pagination?.limit || 12;

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data } = await ArticleService.fetchArticle(page);
      if (!data) {
        setError(true);
        setLoading(false);
        return;
      }

      let updatedData = data.data;
      let updatedSelection = [...selection];

      if (remainingToMark > 0) {
        const toMark = Math.min(remainingToMark, updatedData.length);
        const itemsToMark = updatedData.slice(0, toMark);

        updatedSelection = [...updatedSelection, ...itemsToMark];
        updatedData = updatedData.map((item: DataType, index: number) => ({
          ...item,
          checked: index < toMark,
        }));

        setRemainingToMark(remainingToMark - toMark);
      }

      setSelection(updatedSelection);
      setData({ ...data, data: updatedData });
      setLoading(false);
    }

    fetchData();
  }, [page]);

  const handleSelectionChange = (e: { value: DataType[] }) => {
    const selectedIds = e.value.map((item) => item.id);
    setSelection(e.value);

    setData((prevData) => {
      if (!prevData) return prevData;

      const updatedData = prevData.data.map((item) => ({
        ...item,
        checked: selectedIds.includes(item.id),
      }));

      return { ...prevData, data: updatedData };
    });
  };

  const handleMarkSelected = () => {
    const remaining = markCount;

    const toMark = Math.min(remaining, data?.data.length || 0);
    const updatedSelection = [
      ...selection,
      ...(data?.data.slice(0, toMark) || []),
    ];
    const updatedData = data?.data.map((item, index) => ({
      ...item,
      checked: index < toMark,
    }));

    setSelection(updatedSelection);
    setData((prevData) => {
      if (!prevData) return prevData;
      return {
        ...prevData,
        data: updatedData || [],
      };
    });
    setRemainingToMark(remaining - toMark);
    setMarkCount(0);
    op?.current?.hide();
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Something went wrong</div>;
  }

  return (
    <>
      <OverlayPanel ref={op}>
        <div>
          <p>Enter number to mark:</p>
          <InputNumber
            value={markCount}
            onValueChange={(e) => setMarkCount(e.value || 0)}
          />
          <Button
            label="Mark Selected"
            onClick={handleMarkSelected}
            disabled={!markCount || markCount <= 0}
          />
        </div>
      </OverlayPanel>
      <DataTable
        dataKey={"id"}
        value={data?.data || []}
        size="small"
        showGridlines
        stripedRows
        selection={selection}
        onSelectionChange={handleSelectionChange}
        selectionMode="multiple"
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3rem" }}
        ></Column>
        {LABELS.map((label) => (
          <Column
            key={label.key}
            field={label.key}
            header={
              label.key === "title" ? (
                <div
                  style={{
                    cursor: "pointer",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "row",
                  }}
                  onClick={(e) => op?.current?.toggle(e)}
                >
                  {label.value}
                  <ArrowDown />
                </div>
              ) : (
                label.value
              )
            }
          />
        ))}
      </DataTable>
      <Paginator
        first={(page - 1) * PAGE_SIZE}
        rows={PAGE_SIZE}
        totalRecords={data?.pagination?.total}
        onPageChange={(event) => setPage(event.page + 1)}
        template={{ layout: "PrevPageLink CurrentPageReport NextPageLink" }}
        currentPageReportTemplate={`Showing ${(page - 1) * PAGE_SIZE + 1} to ${
          PAGE_SIZE * page
        } of ${data?.pagination?.total} entries`}
      />
    </>
  );
}

export default App;
