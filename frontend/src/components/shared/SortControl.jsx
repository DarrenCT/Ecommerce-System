import React from 'react';

const SortControl = ({ sortOrder, onSortChange }) => {
    return (
        <div className="flex justify-end mb-4">
            <label htmlFor="sort" className="mr-2 text-gray-700">Sort by:</label>
            <select
                id="sort"
                value={sortOrder}
                onChange={onSortChange}
                className="border rounded-md px-3 py-1"
            >
                <option value="none">None</option>
                <option value="asc">Price: Low to High</option>
                <option value="desc">Price: High to Low</option>
            </select>
        </div>
    );
};

export default SortControl; 