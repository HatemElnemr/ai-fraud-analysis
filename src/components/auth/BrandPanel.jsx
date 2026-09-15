import logo from "/assets/logo.png";

function BrandPanel({ paragraph }) {
  return (
    <div className="hidden sm:flex flex-1 flex-col justify-center items-center h-screen border-r border-[#00F0FF12]">
      <img src={logo} alt="Logo" width="232" height="232" />
      <div className="pt-8 flex flex-col justify-center items-center text-center">
        <h1 className="text-[#F3F4F6] font-orbitron uppercase leading-9 text-[30px] font-bold tracking-[3.6px]">
          Docsense x pro{" "}
        </h1>
        <p className="pt-3 text-[#9CA3AF] font-inter text-[12px] leading-4 tracking-[2.16px] font-normal uppercase">
          {paragraph}
        </p>
      </div>
    </div>
  );
}

export default BrandPanel;
