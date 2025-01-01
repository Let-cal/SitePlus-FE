import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const districts = [
    { name: 'Lê Trần Cát Lâm', district: 'Quận 1', phone: '0982350783', email: 'kan250403@gmail.com', location: 'Hồ Chí Minh', status: 'Active' },
    { name: 'Lê Nguyễn Gia Bảo', district: 'Quận 2', phone: '0982350783', email: 'kan250403@gmail.com', location: 'Hồ Chí Minh', status: 'Inactive' },
    { name: 'Đinh Văn Phong', district: 'Quận 3', phone: '0982350783', email: 'kan250403@gmail.com', location: 'Hồ Chí Minh', status: 'Inactive' },
    { name: 'Nguyễn Kỳ Anh Minh', district: 'Quận 4', phone: '0982350783', email: 'kan250403@gmail.com', location: 'Hồ Chí Minh', status: 'Active' },
    { name: 'Phùi Chếch Minh', district: 'Quận 5', phone: '0982350783', email: 'kan250403@gmail.com', location: 'Hồ Chí Minh', status: 'Active' }
];

const UserManagement = () => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Quản lý khu vực
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[20%]">Tên</TableHead>
                            <TableHead className="w-[17%]">Khu vực</TableHead>
                            <TableHead className="w-[18%]">Thành phố</TableHead>
                            <TableHead className="w-[15%]">Số điện thoại</TableHead>
                            <TableHead className="w-[20%]">Email</TableHead>
                            <TableHead className="w-[10%]">Trạng thái</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {districts.map((district) => (
                            <TableRow key={district.email}>
                                <TableCell>{district.name}</TableCell>
                                <TableCell>{district.district}</TableCell>
                                <TableCell>{district.location}</TableCell>
                                <TableCell>{district.phone}</TableCell>
                                <TableCell>{district.email}</TableCell>
                                <TableCell>
                                    <span className={`py-1 rounded-full text-xs min-w-[70px] inline-block text-center ${district.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {district.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
};

export default UserManagement;