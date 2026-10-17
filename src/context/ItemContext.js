import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import apiFactory from "../api";

const ItemContext = createContext(null);

export const useItemContext = () => {
  return useContext(ItemContext);
};

export const ItemProvider = ({ children }) => {
  const { bidId, bidStatus } = useParams();
  const [itemList, setItemList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bid, setBid] = useState();
  const [searchItem, setSearchItem] = useState({
    limit: 24,
    page: 1,
    searchBranch: "",
    searchRank: "",
  });

  const [item, setItem] = useState({});
  const [activeUrl, setActiveUrl] = useState({});
  const { itemId } = useParams();

  const setFullActiveUrl = (url) => {
    setActiveUrl(
      url?.replace("https://resize.ecoauc.com", "https://assets.ecoauc.com")
    );
  };

  const fetchItemDetail = async () => {
    setIsLoading(true);
    if (!itemId) return;

    const result = await apiFactory.itemApi.getDetail(itemId);

    if (result?.status !== 200) {
      toast.error("can not load bid list");
      return;
    }
    setIsLoading(false);    
    setItem(result?.data);
    setFullActiveUrl(result?.data?.detailUrls?.[0]);
  };

  const fetchItemList = async () => {
    setIsLoading(true);
    if (!bidId) return;

    const result = await apiFactory.itemApi.list({
      ...searchItem,
      bidId,
      bidStatus,
    });

    if (result?.status !== 200) {
      toast.error("can not load bid list");
      return;
    }
    setIsLoading(false);
    setItemList(result?.data);
    // setItemList(
    //   result?.data?.map((e) => {
    //     e?.detailUrl?.map((f) => {
    //       f.replace("https://resize.ecoauc.com", "https://assets.ecoauc.com");
    //       return f;
    //     });
    //     return e;
    //   })
    // );
  };

  const fetchBid = async () => {
    if (!bidId) return;
    const result = await apiFactory.bidApi.getBid({
      bidId,
      bidStatus,
    });

    if (result?.status !== 200) {
      toast.error("can not load bid list");
      return;
    }

    setBid(result?.data);
  };

  const onChooseBranch = (e) => {
    setSearchItem({
      ...searchItem,
      limit: 50,
      page: 1,
      searchBranch: e,
    });
  };

  const onChooseRank = (e) => {
    setSearchItem({
      ...searchItem,
      limit: 50,
      page: 1,
      searchRank: e,
    });
  };

  const onChooseCategory = (e) => {
    setSearchItem({
      ...searchItem,
      limit: 50,
      page: 1,
      searchCategory: e,
    });
  };

  const changePage = (e) => {
    setSearchItem({
      ...searchItem,
      page: e,
    });
  };

  useEffect(() => {
    fetchBid();
  }, [bidId]);

  useEffect(() => {
    fetchItemList();
  }, [bidId, searchItem]);

  useEffect(() => {
    fetchItemDetail();
  }, [itemId]);

  const values = useMemo(
    () => ({
      bidId,
      bidStatus,
      itemList,
      bid,
      item,
      activeUrl,
      setActiveUrl,
      setFullActiveUrl,
      onChooseBranch,
      onChooseRank,
      onChooseCategory,
      changePage,
      isLoading,
      searchItem,
      setItemList,
      setItem
    }),
    [bidId, bidStatus, itemList, bid, isLoading, searchItem, item, activeUrl]
  );

  return <ItemContext.Provider value={values}>{children}</ItemContext.Provider>;
};
