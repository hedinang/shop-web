import React, {useMemo, useState} from "react";
import ReactCountryFlag from "react-country-flag";
import {Dropdown, Pagination} from "antd";
import {DollarOutlined, SortAscendingOutlined} from "@ant-design/icons";
import "./product.scss";

const packageTemplates = [
  {id: 1, name: "Vietnam 5 GB", provider: "Viettel", type: "Local", data: 5, days: 7, price: 4.5, network: "4G", calls: "Data only"},
  {id: 2, name: "Vietnam 10 GB", provider: "Vinaphone", type: "Local", data: 10, days: 15, price: 8, network: "5G", calls: "Data only"},
  {id: 3, name: "Vietnam Unlimited", provider: "MobiFone", type: "Local", data: 30, days: 30, price: 18, network: "5G", calls: "Unlimited calls"},
  {id: 4, name: "Asia 10 GB", provider: "eSIMGo", type: "Regional", data: 10, days: 30, price: 12, network: "5G", calls: "Data only"},
  {id: 5, name: "Asia 20 GB", provider: "NextLink", type: "Regional", data: 20, days: 60, price: 22, network: "5G", calls: "Data only"},
  {id: 6, name: "Global 5 GB", provider: "Bouygues", type: "Global", data: 5, days: 30, price: 20, network: "5G", calls: "Unlimited calls"},
  {id: 7, name: "Vietnam 20 GB", provider: "Viettel", type: "Local", data: 20, days: 90, price: 28, network: "5G", calls: "Data only"},
  {id: 8, name: "Vietnam 50 GB", provider: "Vinaphone", type: "Local", data: 50, days: 365, price: 45, network: "5G", calls: "Data only"},
];

const packages = Array.from({length: 100}, (_, index) => {
  const template = packageTemplates[index % packageTemplates.length];
  const variation = Math.floor(index / packageTemplates.length);
  return {
    ...template,
    id: index + 1,
    name: `${template.name} (${index + 1})`,
    price: Number((template.price + variation * 0.75).toFixed(2)),
  };
});

const currencies = [
  {code: "USD", name: "US Dollar", rate: 3.67},
  {code: "AED", name: "UAE Dirham", rate: 1},
  {code: "AUD", name: "Australian Dollar", rate: 2.42},
  {code: "CAD", name: "Canadian Dollar", rate: 2.69},
  {code: "EUR", name: "Euro", rate: 4},
  {code: "GBP", name: "British Pound", rate: 4.65},
  {code: "HKD", name: "Hong Kong Dollar", rate: 0.47},
];

const sortOptions = [
  {key: "suggested", label: "Suggested"},
  {key: "price", label: "Price (lowest price)"},
  {key: "data", label: "Data (highest first)"},
  {key: "pricePerGb", label: "Price per GB"},
  {key: "validity", label: "Validity"},
];

const filterGroups = [
  {key: "type", title: "Package type", options: ["All", "Local", "Regional", "Global"]},
  {key: "data", title: "Data (GB)", options: ["All", "3GB or more", "5GB or more", "10GB or more", "20GB or more", "50GB or more"]},
  {key: "days", title: "Validity (days)", options: ["All", "14 days or more", "30 days or more", "60 days or more", "90 days or more", "365 days or more"]},
  {key: "price", title: "Price range", options: [10, 20, 30, 50]},
];

const formatPrice = (priceInAed, currency) => new Intl.NumberFormat("en", {
  style: "currency",
  currency: currency.code,
}).format(priceInAed / currency.rate);

const matchesFilter = (product, key, value, currency) => {
  if (value === "All") return true;
  if (key === "type") return product.type === value;
  if (key === "data") return product.data >= Number(value.match(/\d+/)?.[0]);
  if (key === "days") return product.days >= Number(value.match(/\d+/)?.[0]);
  if (key === "price") return product.price / currency.rate <= Number(value);
  return true;
};

const Product = () => {
  const [filters, setFilters] = useState({type: "All", data: "All", days: "All", price: "All"});
  const [currencyCode, setCurrencyCode] = useState("AED");
  const [sortBy, setSortBy] = useState("suggested");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const currency = currencies.find((option) => option.code === currencyCode) || currencies[1];
  const currencyMenuItems = currencies.map((option) => ({
    key: option.code,
    label: `${option.code}  •  ${option.name}`,
  }));
  const selectedSort = sortOptions.find((option) => option.key === sortBy) || sortOptions[0];
  const visiblePackages = useMemo(
    () => {
      const filteredPackages = packages.filter((product) =>
        Object.entries(filters).every(([key, value]) => matchesFilter(product, key, value, currency)),
      );
      const sortComparators = {
        price: (first, second) => first.price - second.price,
        data: (first, second) => second.data - first.data,
        pricePerGb: (first, second) => first.price / first.data - second.price / second.data,
        validity: (first, second) => second.days - first.days,
      };
      return sortComparators[sortBy]
        ? filteredPackages.sort(sortComparators[sortBy])
        : filteredPackages;
    },
    [currency, filters, sortBy],
  );

  const paginatedPackages = visiblePackages.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const clearFilters = () => {
    setFilters({type: "All", data: "All", days: "All", price: "All"});
    setCurrentPage(1);
  };
  const updateFilter = (key, value) => {
    setFilters((current) => ({...current, [key]: value}));
    setCurrentPage(1);
  };

  return (
    <main className="product-page">
      <div className="product-page__heading">
        <div>
          <p className="product-page__eyebrow">eSIM plans</p>
          {/* <h1>eSIM for {countryName}</h1>
          <p className="product-page__subtitle">Choose a plan that fits your trip.</p> */}
        </div>
        <div className="product-page__actions">
          <Dropdown
            menu={{
              items: currencyMenuItems,
              onClick: ({key}) => {
                setCurrencyCode(key);
                setCurrentPage(1);
              },
            }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <button type="button" className="product-action" aria-label={`Currency: ${currency.code}`}>
              <DollarOutlined aria-hidden="true" />
              <span>{currency.code}</span>
            </button>
          </Dropdown>
          <Dropdown
            menu={{
              items: sortOptions,
              selectedKeys: [sortBy],
              onClick: ({key}) => {
                setSortBy(key);
                setCurrentPage(1);
              },
            }}
            placement="bottomRight"
            trigger={["click"]}
          >
            <button type="button" className="product-action" aria-label={`Sort by: ${selectedSort.label}`}>
              <SortAscendingOutlined aria-hidden="true" />
              <span>{selectedSort.label}</span>
            </button>
          </Dropdown>
        </div>
      </div>

      <div className="product-page__layout">
        <aside className="product-filters" aria-label="Product filters">
          <div className="product-filters__heading">
            <h2>Filters</h2>
            <button type="button" onClick={clearFilters}>
              Clear
            </button>
          </div>
          {filterGroups.map((group) => (
            <section className="product-filter" key={group.key}>
              <h3>{group.title}</h3>
              <div className="product-filter__options">
                {group.options.map((option) => {
                  const value = group.key === "price" && option !== "All" ? String(option) : option;
                  const label = group.key === "price" && option !== "All"
                    ? `Up to ${formatPrice(option, currency)}`
                    : option;
                  return (
                    <button
                      className={`product-filter__option${filters[group.key] === value ? " is-active" : ""}`}
                      key={value}
                      onClick={() => updateFilter(group.key, value)}
                      type="button"
                      aria-pressed={filters[group.key] === value}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </aside>

        <section className="product-results" aria-label="Available eSIM packages">
          {visiblePackages.length > 0 ? (
            <div className="product-grid">
              {paginatedPackages.map((product) => (
                <article className="plan-card" key={product.id}>
                  <div className="plan-card__top">
                    <div className="plan-card__brand" aria-hidden="true">{product.provider.slice(0, 1)}</div>
                    <div className="plan-card__identity">
                      <h3>{product.name}</h3>
                      <p>{product.provider}</p>
                    </div>
                    <span className="plan-card__network">{product.network}</span>
                  </div>
                  <div className="plan-card__details">
                    <div><strong>{product.days} days</strong><span>Validity</span></div>
                    <div><strong>{product.data} GB</strong><span>Data</span></div>
                    <div><strong>{formatPrice(product.price, currency)}</strong><span>{product.calls}</span></div>
                  </div>
                  <div className="plan-card__bottom">
                    <span className="plan-card__coverage">
                      <ReactCountryFlag countryCode="VN" svg />
                      {product.type} · Vietnam coverage
                    </span>
                    <button type="button" className="plan-card__link">View offer <span aria-hidden="true">›</span></button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="product-empty">
              <h3>No plans match these filters</h3>
              <p>Try changing or clearing some filters to see available plans.</p>
              <button type="button" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          )}
        </section>
        {visiblePackages.length > pageSize && (
          <nav className="product-pagination" aria-label="Product pages">
            <Pagination
              current={currentPage}
              total={visiblePackages.length}
              pageSize={pageSize}
              showSizeChanger={false}
              onChange={setCurrentPage}
            />
          </nav>
        )}
      </div>
    </main>
  );
};

export {Product};
