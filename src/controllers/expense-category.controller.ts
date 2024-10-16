import { Request, Response } from 'express';
import { db } from '@/db/db';

export const createExpenseCategory = async (req: Request, res: Response) => {
    try {
        // check if slug already exists
        const existingCategory = await db.expenseCategory.findFirst({
            where: { slug: req.body.slug },
        });
        if (existingCategory) {
            res.status(409).json({ error: 'ExpenseCategory with this slug already exists', data: null });
            return;
        }
        const expenseCategory = await db.expenseCategory.create({
            data: req.body,
        });
        res.status(201).json({ data: expenseCategory, error: null });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create expense category', data: null });
    }
};

export const getExpenseCategories = async (req: Request, res: Response) => {
    try {
        const expenseCategories = await db.expenseCategory.findMany(
            { orderBy: { createdAt: 'desc' } },
        );
        res.status(200).json({ data: expenseCategories, error: null });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch expense categories', data: null });
    }
};

export const getExpenseCategoryById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const expenseCategory = await db.expenseCategory.findUnique({
            where: { id },
        });
        if (!expenseCategory) {
            res.status(404).json({ error: 'ExpenseCategory not found', data: null });
            return;
        }
        res.status(200).json({ data: expenseCategory, error: null });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch expense category', data: null });
    }
};

export const updateExpenseCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const existingCategory = await db.expenseCategory.findUnique({
            where: { id },
        });
        if (!existingCategory) {
            res.status(404).json({ error: 'ExpenseCategory not found', data: null });
            return;
        }
        // check if slug already exists if user is updating slug
        if (req.body.slug) {
            const existingCategory = await db.expenseCategory.findFirst({
                where: {
                    slug: req.body.slug,
                },
            });
            if (existingCategory) {
                res.status(409).json({ error: 'ExpenseCategory with this slug already exists', data: null });
                return;
            }
        }
        const expenseCategory = await db.expenseCategory.update({
            where: { id },
            data: req.body,
        });
        res.status(200).json({ data: expenseCategory, error: null });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update expense category', data: null });
    }
};

export const deleteExpenseCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const expenseCategory = await db.expenseCategory.findUnique({
            where: { id },
        });
        if (!expenseCategory) {
            res.status(404).json({ error: 'ExpenseCategory not found', data: null });
            return;
        }
        await db.expenseCategory.delete({
            where: { id },
        });
        res.status(200).send({ message: 'ExpenseCategory deleted successfully' ,data:null});
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete expense category', data: null });
    }
};