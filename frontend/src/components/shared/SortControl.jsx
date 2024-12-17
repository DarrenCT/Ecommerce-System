import React from 'react';
import { FaSortAlphaDown, FaSortAlphaUp, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';

const SortControl = ({ sortOrder, onSortChange }) => {
    return (
        <div className="flex justify-end mb-4 space-x-2 items-center">
            <label htmlFor="sort" className="mr-2 text-gray-700">Sort by:</label>
            <select
                id="sort"
                value={sortOrder}
                onChange={onSortChange}
                className="border rounded-md px-3 py-1"
            >
                <option value="none">None</option>
                <optgroup label="Price">
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                </optgroup>
                <optgroup label="Name">
                    <option value="name-asc">Name: A-Z</option>
                    <option value="name-desc">Name: Z-A</option>
                </optgroup>
            </select>
        </div>
    );
};

export default SortControl; 