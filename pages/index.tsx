import { useState, useEffect } from "react";
import { Link } from "@nextui-org/link";
import { Input } from "@nextui-org/input";
import { button as buttonStyles } from "@nextui-org/theme";
import { Progress } from "@nextui-org/progress";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import { fetchTronTransactions } from "@/util/tron";
import DefaultLayout from "@/layouts/default";
import { Card, CardBody } from "@nextui-org/card";
import { Button } from "@nextui-org/button";

export default function IndexPage() {
  const [address, setAddress] = useState(""); // 存储用户输入的地址
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // 进度条百分比
  const [isMonitoring, setIsMonitoring] = useState(false); // 控制是否显示倒计时

  const fetchTransactions = async () => {
    if (!address) {
      alert("Please enter a valid address");
      return;
    }
    setLoading(true);
    try {
      const data = await fetchTronTransactions(address); // 使用输入的地址
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMonitorClick = () => {
    setIsMonitoring(true); // 开始监控并显示进度条
    setProgress(0); // 重置进度条
  };

  useEffect(() => {
    let intervalId:NodeJS.Timeout | undefined;
    if (isMonitoring) {
      let progressValue = 0;
      intervalId = setInterval(() => {
        if (progressValue >= 100) {
          fetchTransactions(); // 进度条满后获取数据
          setProgress(0); // 重置进度条
          progressValue = 0;
        } else {
          progressValue += 20; // 每秒增加 20%
          setProgress(progressValue);
        }
      }, 1000); // 每秒更新一次进度
    }

    return () => clearInterval(intervalId); // 清除定时器
  }, [isMonitoring]);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div className="inline-block max-w-xl text-center justify-center">
          <span className={title()}>Tron&nbsp;</span>
          <span className={title({ color: "violet" })}>监控&nbsp;</span>
          <br />
          <span className={title()}>
            Monitor transfer information
          </span>
          <div className={subtitle({ class: "mt-4" })}>
            Fast, Safe, and Powerful
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            isExternal
            className={buttonStyles({
              color: "primary",
              radius: "full",
              variant: "shadow",
            })}
            href={siteConfig.links.docs}
          >
            Documentation
          </Link>
          <Link
            isExternal
            className={buttonStyles({ variant: "bordered", radius: "full" })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </Link>
        </div>

        <div className="mt-8 w-1/2">
          <div className="flex w-full flex-wrap md:flex-nowrap mb-6 md:mb-0 gap-4 justify-center items-center">
            <Input
              type="text"
              variant="flat"
              label="Address"
              placeholder="Enter Tron address"
              value={address} // 将地址绑定到输入框
              onChange={(e) => setAddress(e.target.value)} // 输入变化时更新状态
            />
            <button
              className={buttonStyles({
                color: "secondary",
                radius: "full",
                variant: "shadow",
              })}
              onClick={handleMonitorClick} // 点击时触发监控
            >
              Monitor
            </button>
          </div>
        </div>
      </section>

      {isMonitoring && (
        <section className="flex mb-3 flex-col items-center justify-center">
          <Progress className="w-2/3" value={progress} aria-label="Monitoring..." color="secondary"/>
          {/* <p>{5 - progress / 20} seconds remaining...</p> */}
        </section>
      )}

      <section className="flex flex-col items-center justify-center">
        {transactions.length > 0 && (
          <div>
            {transactions.map((transaction) => (
              <Card key={transaction.transaction_id} className="pe-2 m-2">
                <CardBody>
                  <div className="flex flex-col items-center">
                    <div>
                      <Button color="success" variant="light">
                        From
                      </Button>
                      {transaction.from_address}
                      <Button color="warning" variant="light">
                        To
                      </Button>
                      {transaction.to_address}
                    </div>
                    <div>
                      Transaction amount:{" "}
                      <strong>{transaction.quant / 1000000}</strong>{" "}
                      {transaction.tokenInfo.tokenAbbr}
                    </div>
                    <div className="m-2">
                      {new Date(transaction.block_ts).toLocaleString()}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </section>
    </DefaultLayout>
  );
}