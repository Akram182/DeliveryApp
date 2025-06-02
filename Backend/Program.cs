using System.Text;
using Backend;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.FileProviders;
using Newtonsoft.Json;



var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
TgBot telegramBot = new TgBot();

var externalFrontendPath = @"C:\Programming\Projects\DeliveryApp\Frontend";

telegramBot.Start();


app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(externalFrontendPath),//Задаем путь к стилю скрипту и Asset
    RequestPath = ""
});

app.Run(async (context) =>
{
    if (context.Request.Path == "/basket")
    {
        //context.Response.ContentType = "text/html; charset=utf-8";

        await context.Response.SendFileAsync(@"C:\Programming\Projects\DeliveryApp\Frontend\BasketPage.html");
        return;
    }
    else if (context.Request.Path == "/api/buyProd" && HttpMethods.IsPost(context.Request.Method))
    {
        var order = await context.Request.ReadFromJsonAsync<Order>();
        Console.WriteLine("Получен заказ на сумму: " + order.Products[0].Name);
            Console.WriteLine("Получен заказ на сумму: " + order.total);
        return;
    }
    else
    {
        await context.Response.SendFileAsync(@"C:\Programming\Projects\DeliveryApp\Frontend\index.html");
    }
});

app.Run();

public class Product
{
    public string Name { get; set; }
    public int Price { get; set; }
    public int Weight { get; set; }
}

public class Order
{
    public List<Product> Products { get; set; }
    public int total { get; set; }
}


