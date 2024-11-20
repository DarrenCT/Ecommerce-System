const FilterSideBar = ({
    title,
    items,
    selectedItems,
    onSelectionChange
}) => {
    return (
        <div className="w-64 min-h-screen bg-gray-100 p-4 border-r">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
                {items.map((item) => (
                    <div key={item} className="mb-2">
                        <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 p-2 rounded">
                            <input
                                type="checkbox"
                                checked={selectedItems.has(item)}
                                onChange={() => {
                                    const newSelectedItems = new Set(selectedItems);
                                    if (selectedItems.has(item)) {
                                        newSelectedItems.delete(item);
                                    } else {
                                        newSelectedItems.add(item);
                                    }
                                    onSelectionChange(newSelectedItems);
                                }}
                                className="form-checkbox text-amazon-yellow"
                            />
                            <span className="text-gray-700">{item}</span>
                        </label>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FilterSideBar;