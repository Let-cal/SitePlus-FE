import * as React from "react";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import managerService from "../../../../services/manager/manager.service";
import { useDebounce } from 'use-debounce';

// Định nghĩa interface cho dữ liệu nhân viên dựa trên API
interface Staff {
  id: number;
  staffId: number;
  name: string;
  district: string;
  email: string;
  status: number;
  statusName: string;
  createdAt: string;
}

const UserManagement = () => {
  const [staffs, setStaffs] = useState<Staff[]>([]);
  const [filteredStaffs, setFilteredStaffs] = useState<Staff[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchStaffData = async () => {
      const users = await managerService.fetchUsers({ search: debouncedSearchQuery || undefined });
      const managers = users.filter(user => user.roleName === "Area-Manager");
      
      const mappedStaffs: Staff[] = managers.map(user => ({
        id: user.id,
        staffId: user.id,
        name: user.name,
        district: user.districtName,
        email: user.email,
        status: user.status,
        statusName: user.statusName,
        createdAt: user.createdAt,
      }));
      
      const sortedStaffs = [...mappedStaffs].sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      
      setStaffs(sortedStaffs);
      setFilteredStaffs(sortedStaffs);
    };

    fetchStaffData();
  }, [debouncedSearchQuery]);

  const totalPages = Math.ceil(filteredStaffs.length / itemsPerPage);
  const currentItems = filteredStaffs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl md:text-2xl font-extrabold tracking-tight lg:text-3xl">QUẢN LÝ NGƯỜI DÙNG</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex gap-3 flex-wrap justify-end">
              <div className="relative w-[350px]">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[15%]">ID</TableHead>
                <TableHead className="w-[25%]">Tên</TableHead>
                <TableHead className="w-[20%]">Khu vực</TableHead>
                <TableHead className="w-[30%]">Email</TableHead>
                <TableHead className="w-[10%]">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.length > 0 ? (
                currentItems.map((staff) => (
                  <TableRow key={staff.id}>
                    <TableCell>{staff.staffId}</TableCell>
                    <TableCell>{staff.name}</TableCell>
                    <TableCell>{staff.district}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`w-[100px] h-5 flex items-center justify-center ${
                          staff.status === 1
                            ? "bg-green-500"
                            : "bg-gray-500"
                        } text-white text-xs whitespace-nowrap`}
                      >
                        {staff.statusName}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {filteredStaffs.length > 0 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        onClick={() => setCurrentPage(i + 1)}
                        isActive={currentPage === i + 1}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default UserManagement;