import React from 'react'

const listSort = [
    {
        id: 1,
        name: "Bán chạy nhất",
        value: "-quantitySold"
    },
    {
        id: 2,
        name: "Tên A-Z",
        value: "name"
    },
    {
        id: 3,
        name: "Tên Z-A",
        value: "-name"
    },
    {
        id: 4,
        name: "Giá giảm dần",
        value: "-price"
    },
    {
        id: 5,
        name: "Giá tăng dần",
        value: "price"
    },
    {
        id: 6,
        name: "Mới nhất",
        value: "-createdAt"
    },
    {
        id: 7,
        name: "Cũ nhất",
        value: "createdAt"
    }
]

const SelectSort = ({ value, sorts = listSort, handle }) => {
    return (
        <div className="sortBy">
            <label>Sắp xếp</label>
            <select defaultValue={value} onChange={handle}>
                {
                    sorts.map(itemSort => {
                        return <option value={itemSort.value} key={itemSort.id} >{itemSort.name}</option>
                    })
                }
            </select>
        </div>
    )
}

export default SelectSort