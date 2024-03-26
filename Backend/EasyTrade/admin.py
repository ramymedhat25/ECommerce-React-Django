from django.contrib import admin
from .models import Category, Order, Wishlist, Review
from .models import Product, ProductImage

admin.site.register(Order)
admin.site.register(Review)
admin.site.register(Wishlist)
admin.site.register(Category)

class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1
@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    inlines = [ProductImageInline]
    list_display = ('title', 'price')
    search_fields = ['title']
    list_filter = ['brand']

