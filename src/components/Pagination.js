import Pagination from 'react-bootstrap/Pagination';

const CustomePagination = ({currentPage, totalPage, navigatePage}) => {
  return (
    <div className='d-flex align-items-center justify-content-center' style={{textAlign:'end'}}>
        <Pagination>
            <Pagination.First onClick={() => {navigatePage(false, currentPage, totalPage)}} disabled={currentPage===1}/>
            <Pagination.Item disabled>{currentPage}/{totalPage}</Pagination.Item>
            <Pagination.Last onClick={() => {navigatePage(true, currentPage, totalPage)}} disabled={currentPage===totalPage}/>
        </Pagination>
    </div>
  );
}

export default CustomePagination;